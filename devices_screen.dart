import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Voltify',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      ),
      home: const DevicesScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class DevicesScreen extends StatefulWidget {
  const DevicesScreen({super.key});

  @override
  State<DevicesScreen> createState() => _DevicesScreenState();
}

class _DevicesScreenState extends State<DevicesScreen> {
  final db = FirebaseDatabase.instance.ref("energyMonitor");
  int _selectedIndex = 1; // Devices tab selected
  
  // Local storage for device names (relayKey -> deviceName)
  final Map<String, String> _deviceNames = {};
  
  // Text editing controllers for device names
  final Map<String, TextEditingController> _nameControllers = {};

  // Helper function to parse relay value (0 = ON, 1 = OFF)
  bool _parseRelayValue(dynamic rawRelay) {
    if (rawRelay == null) return false;
    if (rawRelay is int) return rawRelay == 0;
    if (rawRelay is double) return rawRelay.toInt() == 0;
    if (rawRelay is String) return int.tryParse(rawRelay) == 0;
    return false;
  }

  // Get all relays from Firebase data, sorted properly
  List<MapEntry<String, bool>> _getRelays(Map<String, dynamic> data) {
    Map<String, bool> relays = {};
    
    // Find all relay keys (relay, relay1, relay2, etc.)
    data.forEach((key, value) {
      if (key == 'relay' || (key.startsWith('relay') && RegExp(r'^relay\d+$').hasMatch(key))) {
        relays[key] = _parseRelayValue(value);
      }
    });
    
    // Sort relays: 'relay' first, then relay1, relay2, etc. numerically
    List<MapEntry<String, bool>> sortedRelays = relays.entries.toList();
    sortedRelays.sort((a, b) {
      if (a.key == 'relay') return -1;
      if (b.key == 'relay') return 1;
      
      // Extract numbers from relay1, relay2, etc.
      int aNum = int.tryParse(a.key.replaceAll('relay', '')) ?? 0;
      int bNum = int.tryParse(b.key.replaceAll('relay', '')) ?? 0;
      return aNum.compareTo(bNum);
    });
    
    return sortedRelays;
  }
  
  // Get or create device name for a relay
  String _getDeviceName(String relayKey, int index) {
    if (!_deviceNames.containsKey(relayKey)) {
      _deviceNames[relayKey] = 'Device ${index + 1}';
    }
    return _deviceNames[relayKey]!;
  }
  
  // Initialize controller for device name editing
  TextEditingController _getController(String relayKey, int index) {
    if (!_nameControllers.containsKey(relayKey)) {
      _nameControllers[relayKey] = TextEditingController(
        text: _getDeviceName(relayKey, index),
      );
    }
    return _nameControllers[relayKey]!;
  }
  
  @override
  void dispose() {
    // Dispose all controllers
    _nameControllers.values.forEach((controller) => controller.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: StreamBuilder(
          stream: db.onValue,
          builder: (context, snapshot) {
            if (!snapshot.hasData || snapshot.data?.snapshot.value == null) {
              return const Center(child: CircularProgressIndicator());
            }

            final data = Map<String, dynamic>.from(
              snapshot.data!.snapshot.value as Map
            );

            // Read values from Firebase
            double power = (data["power"] ?? 0.0).toDouble();
            double powerKW = power / 1000.0; // Convert W to kW

            // Get all relays (sorted)
            List<MapEntry<String, bool>> relays = _getRelays(data);
            int totalRelays = relays.length;
            int activeRelays = relays.where((entry) => entry.value).length;

            return Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Devices',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Summary Card
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0E0E0),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Active Devices',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.black87,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              relays.isEmpty ? '0/0' : '$activeRelays/$totalRelays',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'Total Power',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.black87,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${powerKW.toStringAsFixed(1)} kW',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Device List
                Expanded(
                  child: relays.isEmpty
                      ? const Center(
                          child: Padding(
                            padding: EdgeInsets.all(32.0),
                            child: Text(
                              'No relays found',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.black54,
                              ),
                            ),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                          itemCount: relays.length,
                          itemBuilder: (context, index) {
                            String relayKey = relays[index].key;
                            bool isOn = relays[index].value;
                            
                            return Padding(
                              padding: EdgeInsets.only(
                                bottom: index < relays.length - 1 ? 12 : 0,
                              ),
                              child: _buildDeviceCard(
                                relayKey: relayKey,
                                isOn: isOn,
                                index: index,
                              ),
                            );
                          },
                        ),
                ),
              ],
            );
          },
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.blue,
          unselectedItemColor: Colors.grey,
          backgroundColor: Colors.white,
          elevation: 0,
          items: [
            BottomNavigationBarItem(
              icon: Icon(_selectedIndex == 0 ? Icons.home : Icons.home_outlined),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(_selectedIndex == 1 ? Icons.flash_on : Icons.flash_off),
              label: 'Devices',
            ),
            BottomNavigationBarItem(
              icon: Icon(_selectedIndex == 2 ? Icons.timeline : Icons.timeline_outlined),
              label: 'Usage',
            ),
            BottomNavigationBarItem(
              icon: Icon(_selectedIndex == 3 ? Icons.description : Icons.description_outlined),
              label: 'Bill',
            ),
            BottomNavigationBarItem(
              icon: Icon(_selectedIndex == 4 ? Icons.settings : Icons.settings_outlined),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeviceCard({
    required String relayKey,
    required bool isOn,
    required int index,
  }) {
    final controller = _getController(relayKey, index);
    
    return Card(
      elevation: 2,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            // Device Icon (power icon for all)
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.blue,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.power,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            // Device Info with Editable Name
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: controller,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                    onChanged: (value) {
                      setState(() {
                        _deviceNames[relayKey] = value.isEmpty 
                            ? 'Device ${index + 1}' 
                            : value;
                      });
                    },
                  ),
                  const SizedBox(height: 4),
                  Text(
                    relayKey,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.black54,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
            // Toggle Switch
            Switch(
              value: isOn,
              onChanged: (bool newValue) {
                // Update Firebase: 0 = ON, 1 = OFF
                int relayToSend = newValue ? 0 : 1;
                db.update({relayKey: relayToSend});
              },
              activeColor: Colors.blue,
              inactiveThumbColor: Colors.grey[300],
              inactiveTrackColor: Colors.grey[300],
            ),
          ],
        ),
      ),
    );
  }
}

