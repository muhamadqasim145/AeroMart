import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class EnergyStatisticsScreen extends StatefulWidget {
  const EnergyStatisticsScreen({super.key});

  @override
  State<EnergyStatisticsScreen> createState() => _EnergyStatisticsScreenState();
}

class _EnergyStatisticsScreenState extends State<EnergyStatisticsScreen> {
  String _selectedPeriod = 'Daily'; // Daily, Weekly, Monthly

  // Sample data - replace with actual data from your backend
  final Map<String, double> _energyData = {
    'Today': 12.5,
    'This Week': 87.3,
    'This Month': 342.8,
  };

  // Sample device consumption data
  List<DeviceConsumption> _getDeviceData() {
    switch (_selectedPeriod) {
      case 'Daily':
        return [
          DeviceConsumption('AC Unit', 4.2, const Color(0xFF2196F3)),
          DeviceConsumption('Refrigerator', 2.8, const Color(0xFF4CAF50)),
          DeviceConsumption('Washing Machine', 1.9, const Color(0xFF00BCD4)),
          DeviceConsumption('TV', 1.2, const Color(0xFFFF9800)),
          DeviceConsumption('Lights', 0.8, const Color(0xFF9C27B0)),
          DeviceConsumption('Other', 1.6, const Color(0xFF607D8B)),
        ];
      case 'Weekly':
        return [
          DeviceConsumption('AC Unit', 29.4, const Color(0xFF2196F3)),
          DeviceConsumption('Refrigerator', 19.6, const Color(0xFF4CAF50)),
          DeviceConsumption('Washing Machine', 13.3, const Color(0xFF00BCD4)),
          DeviceConsumption('TV', 8.4, const Color(0xFFFF9800)),
          DeviceConsumption('Lights', 5.6, const Color(0xFF9C27B0)),
          DeviceConsumption('Other', 11.2, const Color(0xFF607D8B)),
        ];
      case 'Monthly':
        return [
          DeviceConsumption('AC Unit', 117.6, const Color(0xFF2196F3)),
          DeviceConsumption('Refrigerator', 78.4, const Color(0xFF4CAF50)),
          DeviceConsumption('Washing Machine', 53.2, const Color(0xFF00BCD4)),
          DeviceConsumption('TV', 33.6, const Color(0xFFFF9800)),
          DeviceConsumption('Lights', 22.4, const Color(0xFF9C27B0)),
          DeviceConsumption('Other', 37.6, const Color(0xFF607D8B)),
        ];
      default:
        return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    final deviceData = _getDeviceData();
    final maxConsumption = deviceData.map((d) => d.consumption).reduce((a, b) => a > b ? a : b);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Energy Statistics',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Three summary cards
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      'Today',
                      '${_energyData['Today']!.toStringAsFixed(1)} kWh',
                      const Color(0xFF2196F3),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      'This Week',
                      '${_energyData['This Week']!.toStringAsFixed(1)} kWh',
                      const Color(0xFF4CAF50),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      'This Month',
                      '${_energyData['This Month']!.toStringAsFixed(1)} kWh',
                      const Color(0xFF00BCD4),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              // Filter dropdown and chart section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Device Consumption',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[300]!),
                    ),
                    child: DropdownButton<String>(
                      value: _selectedPeriod,
                      underline: const SizedBox(),
                      icon: const Icon(Icons.arrow_drop_down, color: Colors.black),
                      items: ['Daily', 'Weekly', 'Monthly'].map((String period) {
                        return DropdownMenuItem<String>(
                          value: period,
                          child: Text(
                            period,
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        if (newValue != null) {
                          setState(() {
                            _selectedPeriod = newValue;
                          });
                        }
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Bar chart
              Container(
                height: 300,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: BarChart(
                  BarChartData(
                    alignment: BarChartAlignment.spaceAround,
                    maxY: maxConsumption * 1.2, // Add 20% padding at top
                    barTouchData: BarTouchData(
                      enabled: true,
                      touchTooltipData: BarTouchTooltipData(
                        getTooltipColor: (group) => Colors.grey[800]!,
                        tooltipRoundedRadius: 8,
                        tooltipPadding: const EdgeInsets.all(8),
                        tooltipMargin: 8,
                        getTooltipItem: (group, groupIndex, rod, rodIndex) {
                          return BarTooltipItem(
                            '${deviceData[groupIndex].device}\n${rod.toY.toStringAsFixed(1)} kWh',
                            const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          );
                        },
                      ),
                    ),
                    titlesData: FlTitlesData(
                      show: true,
                      rightTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (value, meta) {
                            if (value.toInt() >= 0 && value.toInt() < deviceData.length) {
                              return Padding(
                                padding: const EdgeInsets.only(top: 8),
                                child: Text(
                                  deviceData[value.toInt()].device,
                                  style: const TextStyle(
                                    color: Colors.black54,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              );
                            }
                            return const Text('');
                          },
                          reservedSize: 50,
                        ),
                      ),
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          reservedSize: 50,
                          getTitlesWidget: (value, meta) {
                            return Text(
                              '${value.toInt()}',
                              style: const TextStyle(
                                color: Colors.black54,
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    gridData: FlGridData(
                      show: true,
                      drawVerticalLine: false,
                      horizontalInterval: maxConsumption > 0 ? maxConsumption / 5 : 10,
                      getDrawingHorizontalLine: (value) {
                        return FlLine(
                          color: Colors.grey[200]!,
                          strokeWidth: 1,
                        );
                      },
                    ),
                    borderData: FlBorderData(
                      show: true,
                      border: Border(
                        bottom: BorderSide(color: Colors.grey[300]!, width: 1),
                        left: BorderSide(color: Colors.grey[300]!, width: 1),
                      ),
                    ),
                    barGroups: deviceData.asMap().entries.map((entry) {
                      int index = entry.key;
                      DeviceConsumption device = entry.value;
                      return BarChartGroupData(
                        x: index,
                        barRods: [
                          BarChartRodData(
                            toY: device.consumption,
                            color: device.color,
                            width: 30,
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(8),
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              // Legend
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Wrap(
                  spacing: 16,
                  runSpacing: 12,
                  children: deviceData.map((device) {
                    return Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: device.color,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          device.device,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black87,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String value, Color accentColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: accentColor,
            ),
          ),
        ],
      ),
    );
  }
}

class DeviceConsumption {
  final String device;
  final double consumption;
  final Color color;

  DeviceConsumption(this.device, this.consumption, this.color);
}













