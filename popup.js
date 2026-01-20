// DOM Elements
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const hotelNameInput = document.getElementById("hotelName");
const roomNameInput = document.getElementById("roomName");
const roomsInput = document.getElementById("rooms");
const guestsPerRoomInput = document.getElementById("guestsPerRoom");
const numGuestsInput = document.getElementById("numGuests");
const guestsContainer = document.getElementById("guestsContainer");
const saveBtn = document.getElementById("saveBtn");
const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");

// Payment fields
const cardNumber = document.getElementById("cardNumber");
const cardMonth = document.getElementById("cardMonth");
const cardYear = document.getElementById("cardYear");
const cvv = document.getElementById("cvv");
const billingAddress = document.getElementById("billingAddress");
const billingCity = document.getElementById("billingCity");
const billingState = document.getElementById("billingState");
const billingZip = document.getElementById("billingZip");
const billingCountry = document.getElementById("billingCountry");

// Default hotel/room names to match current flow
hotelNameInput.value = "Kawada Hotel";
roomNameInput.value = "Twin Beds Non Smoking";

// Set default dates (current date + 1 month for check-in)
function setDefaultDates() {
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 30);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + 4);

  checkInInput.value = checkIn.toISOString().split("T")[0];
  checkOutInput.value = checkOut.toISOString().split("T")[0];
}

// Generate guest information forms
function generateGuestForms() {
  const numGuests = parseInt(numGuestsInput.value) || 2;
  guestsContainer.innerHTML = "";

  for (let i = 0; i < numGuests; i++) {
    const guestSection = document.createElement("div");
    guestSection.className = "guest-section";
    guestSection.innerHTML = `
      <h3>Guest ${i + 1} Information</h3>
      
      <label for="guest${i}_firstName">First Name:</label>
      <input type="text" id="guest${i}_firstName" required>
      
      <label for="guest${i}_lastName">Last Name:</label>
      <input type="text" id="guest${i}_lastName" required>
      
      <label for="guest${i}_email">Email:</label>
      <input type="email" id="guest${i}_email" required>
      
      <label for="guest${i}_phone">Phone:</label>
      <input type="tel" id="guest${i}_phone" placeholder="123-456-7890" required>
      
      <label for="guest${i}_address">Address:</label>
      <input type="text" id="guest${i}_address" required>
      
      <label for="guest${i}_city">City:</label>
      <input type="text" id="guest${i}_city" required>
      
      <label for="guest${i}_state">State/Province:</label>
      <input type="text" id="guest${i}_state" required>
      
      <label for="guest${i}_zip">ZIP/Postal Code:</label>
      <input type="text" id="guest${i}_zip" required>
      
      <label for="guest${i}_country">Country:</label>
      <input type="text" id="guest${i}_country" value="USA" required>
    `;
    guestsContainer.appendChild(guestSection);
  }
}

// Load saved configuration
function loadConfig() {
  chrome.storage.local.get(["bookingConfig"], (result) => {
    if (result.bookingConfig) {
      const config = result.bookingConfig;

      // Booking details
      if (config.checkIn) checkInInput.value = config.checkIn;
      if (config.checkOut) checkOutInput.value = config.checkOut;
      if (config.hotelName) hotelNameInput.value = config.hotelName;
      if (config.roomName) roomNameInput.value = config.roomName;
      if (config.rooms) roomsInput.value = config.rooms;
      if (config.guestsPerRoom) guestsPerRoomInput.value = config.guestsPerRoom;
      if (config.numGuests) numGuestsInput.value = config.numGuests;

      // Generate guest forms first
      generateGuestForms();

      // Load guest information
      if (config.guests) {
        config.guests.forEach((guest, i) => {
          document.getElementById(`guest${i}_firstName`).value =
            guest.firstName || "";
          document.getElementById(`guest${i}_lastName`).value =
            guest.lastName || "";
          document.getElementById(`guest${i}_email`).value = guest.email || "";
          document.getElementById(`guest${i}_phone`).value = guest.phone || "";
          document.getElementById(`guest${i}_address`).value =
            guest.address || "";
          document.getElementById(`guest${i}_city`).value = guest.city || "";
          document.getElementById(`guest${i}_state`).value = guest.state || "";
          document.getElementById(`guest${i}_zip`).value = guest.zip || "";
          document.getElementById(`guest${i}_country`).value =
            guest.country || "USA";
        });
      }

      // Payment information
      if (config.payment) {
        cardNumber.value = config.payment.cardNumber || "";
        cardMonth.value = config.payment.cardMonth || "";
        cardYear.value = config.payment.cardYear || "";
        cvv.value = config.payment.cvv || "";
        billingAddress.value = config.payment.billingAddress || "";
        billingCity.value = config.payment.billingCity || "";
        billingState.value = config.payment.billingState || "";
        billingZip.value = config.payment.billingZip || "";
        billingCountry.value = config.payment.billingCountry || "USA";
      }

      showStatus("Configuration loaded!", "success");
    }
  });
}

// Save configuration
function saveConfig() {
  const numGuests = parseInt(numGuestsInput.value) || 2;
  const guests = [];

  for (let i = 0; i < numGuests; i++) {
    guests.push({
      firstName: document.getElementById(`guest${i}_firstName`).value,
      lastName: document.getElementById(`guest${i}_lastName`).value,
      email: document.getElementById(`guest${i}_email`).value,
      phone: document.getElementById(`guest${i}_phone`).value,
      address: document.getElementById(`guest${i}_address`).value,
      city: document.getElementById(`guest${i}_city`).value,
      state: document.getElementById(`guest${i}_state`).value,
      zip: document.getElementById(`guest${i}_zip`).value,
      country: document.getElementById(`guest${i}_country`).value,
    });
  }

  const config = {
    checkIn: checkInInput.value,
    checkOut: checkOutInput.value,
    rooms: roomsInput.value,
    guestsPerRoom: guestsPerRoomInput.value,
    numGuests: numGuestsInput.value,
    hotelName: hotelNameInput.value,
    roomName: roomNameInput.value,
    guests: guests,
    payment: {
      cardNumber: cardNumber.value,
      cardMonth: cardMonth.value,
      cardYear: cardYear.value,
      cvv: cvv.value,
      billingAddress: billingAddress.value,
      billingCity: billingCity.value,
      billingState: billingState.value,
      billingZip: billingZip.value,
      billingCountry: billingCountry.value,
    },
  };

  chrome.storage.local.set({ bookingConfig: config }, () => {
    showStatus("Configuration saved successfully!", "success");
  });
}

// Start automation
function startAutomation() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "startAutomation" },
        (response) => {
          if (chrome.runtime.lastError) {
            showStatus("Error: Make sure you are on the booking page", "error");
          } else if (response && response.success) {
            showStatus("Automation started!", "info");
          } else {
            showStatus("Failed to start automation", "error");
          }
        },
      );
    }
  });
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status show ${type}`;
  setTimeout(() => {
    statusDiv.className = "status";
  }, 5000);
}

// Event listeners
saveBtn.addEventListener("click", saveConfig);
startBtn.addEventListener("click", startAutomation);
numGuestsInput.addEventListener("change", generateGuestForms);

// Initialize
setDefaultDates();
generateGuestForms();
loadConfig();
