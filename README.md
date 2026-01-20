# Quick Hotel Booker - Chrome Extension

A Chrome extension that automates the hotel booking process for Emerald City Comic Con 2026.

## Features

- **One-Click Automation**: Automate the entire booking workflow
- **Dynamic Configuration**: Set check-in/out dates, rooms, and guest information
- **Multi-Guest Support**: Configure information for multiple guests
- **Smart Error Handling**: Fallback options when preferred selections aren't available
- **Secure Storage**: All information is stored locally in your browser

## Installation

1. **Clone or download this repository**

2. **Generate Icons** (Temporary Step):
   - The extension needs icon files (16x16, 48x48, 128x128 PNG)
   - You can:
     - Create simple colored squares as placeholders
     - Use an online icon generator
     - Or create them using any image editor
   - Place them in the `icons/` folder as:
     - `icon16.png`
     - `icon48.png`
     - `icon128.png`

3. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `quick-book` folder

## Usage

### Step 1: Configure Your Information

1. Click the extension icon in Chrome toolbar
2. Fill in all required fields:
   - **Booking Details**: Check-in/out dates, rooms, guests per room
   - **Guest Information**: Personal details for each guest
   - **Payment Information**: Credit card and billing details
3. Click "**Save Configuration**"

### Step 2: Start Automation

1. Navigate to the booking website: `https://book.passkey.com/`
2. Click the extension icon
3. Click "**Start Automation**"
4. The extension will automatically:
   - Select attendee type ("1 - FAN")
   - Fill in dates and search parameters
   - Select Kawada Hotel (or prompt you to select manually)
   - Select Twin Beds Non Smoking room
   - Fill in all guest information
   - Fill in payment details

### Step 3: Review and Complete

- The extension will pause at the payment page
- **Review all information carefully**
- Manually submit the final payment

## Automation Flow

1. **Welcome Page** (`/home` or `/landing`):
   - Selects "1 - FAN" from attendee type dropdown
   - Clicks "Make Reservation"

2. **Select Time** (`/landing`):
   - Fills check-in date (from config)
   - Fills check-out date (from config)
   - Sets number of rooms
   - Sets guests per room
   - Clicks "Search"

3. **Select Hotel** (`/list/hotels`):
   - Searches for "Kawada Hotel"
   - Clicks "Select" button
   - Falls back to manual selection if not found

4. **Select Room** (`/rooms/list` or `/rooms/select`):
   - Searches for "Twin Beds Non Smoking"
   - Clicks "Select" button
   - Falls back to manual selection if not found

5. **Guest Information** (`/guestdetails`):
   - Auto-fills all guest information from config
   - Clicks "Next"

6. **Payment** (`/payment`):
   - Auto-fills payment information
   - **Waits for manual review and submission**

## Configuration Fields

### Booking Details

- Check-In Date
- Check-Out Date
- Number of Rooms
- Guests per Room

### Guest Information (per guest)

- First Name
- Last Name
- Email
- Phone
- Address
- City
- State/Province
- ZIP/Postal Code
- Country

### Payment Information

- Card Number
- Expiration Month (MM)
- Expiration Year (YY)
- CVV
- Billing Address
- City
- State/Province
- ZIP/Postal Code
- Country

## Error Handling

- **Dates Not Available**: The extension will attempt to use the dates you configured. If they don't exist in the dropdown, you may need to manually select available dates.
- **Hotel Not Found**: If "Kawada Hotel" is not available, the extension will highlight the hotel section and wait for you to manually select a hotel, then continue automation.
- **Room Not Found**: Similar to hotels, if "Twin Beds Non Smoking" is not available, manual selection is required.

## Security Notes

⚠️ **Important**:

- All data is stored locally in your browser using Chrome's storage API
- Credit card information is stored in plain text locally
- This is a **class project** and should not be used for real transactions
- Never share your configuration with others
- Clear stored data after use

## Development

### File Structure

```
quick-book/
├── manifest.json         # Extension configuration
├── popup.html           # Extension popup UI
├── popup.css            # Popup styling
├── popup.js             # Popup logic
├── content.js           # Page automation logic
├── background.js        # Background service worker
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Technologies Used

- Chrome Extensions Manifest V3
- Vanilla JavaScript
- Chrome Storage API
- Content Scripts
- Message Passing

## Troubleshooting

**Extension not working?**

- Make sure you're on the correct website: `https://book.passkey.com/`
- Check that you've saved your configuration first
- Open Developer Tools (F12) and check Console for errors
- Reload the extension from `chrome://extensions/`

**Fields not filling?**

- The website structure may have changed
- Check browser console for errors
- You may need to manually fill some fields

**Automation stops?**

- This is expected at certain decision points
- Continue manually and the automation may resume on the next page

## License

This is a class project for educational purposes.

## Credits

Created for Software Engineering class project.
