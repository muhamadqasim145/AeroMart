# Energy Statistics Screen

A Flutter screen for displaying energy consumption statistics in a Smart Energy Management app.

## Features

- **Summary Cards**: Three cards showing total energy consumed today, this week, and this month
- **Interactive Bar Chart**: Visual comparison of energy consumption across different devices
- **Period Filter**: Dropdown to switch between daily, weekly, and monthly data views
- **Modern Design**: Minimalistic theme with white background, blue and green accents, and rounded cards

## Dependencies

Add the following dependency to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  fl_chart: ^0.65.0
```

Then run:
```bash
flutter pub get
```

## Usage

### Basic Integration

```dart
import 'package:your_app/energy_statistics_screen.dart';

// Navigate to the screen
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => const EnergyStatisticsScreen(),
  ),
);
```

### Integration with Navigation

If you're using the bottom navigation bar (like in `devices_screen.dart`), you can add it as a tab:

```dart
// In your main screen with bottom navigation
case 2: // Usage tab
  return const EnergyStatisticsScreen();
```

## Customization

### Connecting to Real Data

Replace the sample data in `_EnergyStatisticsScreenState`:

1. **Summary Data**: Update `_energyData` map with actual values from your backend
2. **Device Data**: Modify `_getDeviceData()` to fetch real device consumption data

Example with Firebase:
```dart
StreamBuilder<DatabaseEvent>(
  stream: db.onValue,
  builder: (context, snapshot) {
    // Parse your Firebase data
    // Update _energyData and device consumption
  },
)
```

### Customizing Colors

The screen uses:
- **Blue accent**: `Color(0xFF2196F3)` - Primary blue
- **Green accent**: `Color(0xFF4CAF50)` - Primary green
- **Cyan accent**: `Color(0xFF00BCD4)` - Secondary accent

You can modify these in:
- `_buildSummaryCard()` for summary cards
- `_getDeviceData()` for bar chart colors

### Adding More Devices

Simply add more entries to the list returned by `_getDeviceData()`:

```dart
DeviceConsumption('New Device', 2.5, const Color(0xFFE91E63)),
```

## Screen Structure

- **Top Section**: Three summary cards in a row
- **Middle Section**: Filter dropdown and bar chart
- **Bottom Section**: Color-coded legend for devices

## Notes

- The chart automatically scales based on the maximum consumption value
- Tooltips appear when tapping on bars
- The design is responsive and works on different screen sizes
- All values are displayed in kWh (kilowatt-hours)













