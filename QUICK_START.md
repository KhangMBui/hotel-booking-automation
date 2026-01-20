# Quick Hotel Booker - Quick Start Guide

## 🚀 Installation Steps

### 1. Load Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle switch in top-right corner)
4. Click **"Load unpacked"** button
5. Browse to and select the `c:\Users\khang\quick-book` folder
6. The extension should now appear in your extensions list!

### 2. Pin the Extension (Optional but Recommended)

1. Click the puzzle piece icon in Chrome toolbar
2. Find "Quick Hotel Booker"
3. Click the pin icon to keep it visible

---

## 📝 How to Use

### Configuration (Do This First!)

1. **Click the extension icon** in Chrome toolbar
2. **Fill in the Booking Details section:**
   - Check-In Date (e.g., July 1, 2026)
   - Check-Out Date (e.g., July 5, 2026)
   - Number of Rooms: 1
   - Guests per Room: 2

3. **Set Number of Guests:**
   - Change to match your needs (default: 2)
   - This will generate forms for each guest

4. **Fill in Guest Information** for each guest:
   - First Name
   - Last Name
   - Email
   - Phone
   - Address
   - City
   - State/Province
   - ZIP/Postal Code
   - Country

5. **Fill in Payment Information:**
   - Card Number
   - Expiration Month (MM)
   - Expiration Year (YY)
   - CVV
   - Billing Address
   - City
   - State
   - ZIP
   - Country

6. **Click "Save Configuration"** - You should see a green success message

---

### Running the Automation

1. **Navigate to the booking website:**

   ```
   https://book.passkey.com/event/51027735/owner/14227/home
   ```

2. **Click the extension icon**

3. **Click "Start Automation"** button

4. **Sit back and watch!** The extension will:
   - ✅ Select "1 - FAN" from attendee type
   - ✅ Click "Make Reservation"
   - ✅ Fill in your dates and search
   - ✅ Select Kawada Hotel
   - ✅ Select Twin Beds Non Smoking room
   - ✅ Fill in all guest information
   - ✅ Fill in payment information

5. **At the payment page:**
   - ⚠️ **REVIEW ALL INFORMATION CAREFULLY**
   - The extension will NOT auto-submit payment
   - You must manually review and click the final submit button

---

## 🔧 Troubleshooting

### Extension Icon Not Showing Up?

- Check that Developer mode is enabled
- Reload the extension from `chrome://extensions/`
- Make sure you selected the correct folder

### "Start Automation" Does Nothing?

- Verify you're on `book.passkey.com`
- Make sure you saved your configuration first
- Open DevTools (F12) → Console tab to check for errors

### Fields Not Filling Automatically?

- The website structure may have changed
- You can manually fill fields and click next - automation may resume
- Check the browser console for error messages

### Hotel or Room Not Found?

- The extension will highlight the section
- Manually select your preferred option
- The automation should continue after your selection

### Dates Not Available?

- Try selecting available dates manually
- The extension will continue with subsequent steps

---

## ⚙️ Advanced Usage

### Changing Configuration

- You can update your configuration anytime
- Just click the extension icon, modify fields, and click "Save Configuration" again

### Multiple Guests

- Change the "Number of Guests" field
- Additional guest forms will appear automatically
- Each guest gets their own set of information fields

### Testing

- You can run the automation multiple times
- It's safe to test - the extension won't submit payment automatically

---

## 🛡️ Security & Privacy

- All data is stored locally in Chrome's storage
- No data is sent to external servers
- Credit card info is stored in plain text locally
- **Important:** This is for educational purposes only
- Clear your configuration after use if sharing the computer

### To Clear Stored Data:

1. Go to `chrome://extensions/`
2. Find "Quick Hotel Booker"
3. Click "Remove"
4. Or: Right-click extension icon → Manage Extension → Remove

---

## 📋 Automation Flow Summary

| Page         | Automated Actions                            | User Actions                  |
| ------------ | -------------------------------------------- | ----------------------------- |
| Welcome      | Select attendee type, click Make Reservation | None - automatic              |
| Select Time  | Fill dates, rooms, guests, click Search      | None - automatic              |
| Select Hotel | Find & select Kawada Hotel                   | Manual selection if not found |
| Select Room  | Find & select Twin Beds room                 | Manual selection if not found |
| Guest Info   | Fill all guest details, click Next           | None - automatic              |
| Payment      | Fill payment info                            | **REVIEW & SUBMIT MANUALLY**  |

---

## 🎓 For Your Class Project

### Demo Tips:

1. Have your configuration saved before demo
2. Start from the welcome page
3. Show the popup UI first
4. Explain what each page does as automation runs
5. Emphasize the safety feature (manual payment submission)

### What to Mention:

- Chrome Extensions Manifest V3
- Content Scripts for page automation
- Chrome Storage API for data persistence
- DOM manipulation and event triggering
- Error handling and fallback mechanisms

---

## 📝 Notes

- The extension works specifically with `book.passkey.com`
- It's designed for the Emerald City Comic Con 2026 booking flow
- Some manual intervention may be needed if page structure changes
- Always review all information before final submission

---

## Need Help?

1. Check the browser console (F12 → Console)
2. Look for error messages in red
3. Verify all configuration is saved
4. Try refreshing the page and starting again

---

**Good luck with your class project! 🎉**
