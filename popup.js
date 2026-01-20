// DOM Elements
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const roomsInput = document.getElementById("rooms");
const guestsPerRoomInput = document.getElementById("guestsPerRoom");
const numGuestsInput = document.getElementById("numGuests");
const guestsContainer = document.getElementById("guestsContainer");
const hotelPriorityContainer = document.getElementById(
  "hotelPriorityContainer",
);
const roomPriorityContainer = document.getElementById("roomPriorityContainer");
const addHotelBtn = document.getElementById("addHotelBtn");
const addRoomBtn = document.getElementById("addRoomBtn");
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

// Default priority lists based on user's image
const defaultHotelPriorities = [
  "Moxy Downtown Los Angeles",
  "Courtyard Los Angeles L.A. Live",
  "Residence Inn Los Angeles L.A. Live",
  "AC Hotel Downtown Los Angeles",
  "E-Central Hotel",
];

const defaultRoomPriorities = [
  "Guest room, 2 Queen",
  "2 queens bed",
  "Cheapest room",
  "1 bed",
];

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

// Generate hotel priority list UI
function generateHotelPriorityList(hotelList = defaultHotelPriorities) {
  hotelPriorityContainer.innerHTML = "";

  hotelList.forEach((hotel, index) => {
    const hotelItem = document.createElement("div");
    hotelItem.className = "priority-item";
    hotelItem.style.cssText =
      "display: flex; gap: 10px; margin-bottom: 8px; align-items: center;";
    hotelItem.innerHTML = `
      <span style="min-width: 25px; font-weight: bold; color: #667eea;">${index + 1}.</span>
      <input type="text" class="hotel-priority-input" value="${hotel}" 
             style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
             placeholder="Enter hotel name">
      <button type="button" class="remove-hotel-btn" data-index="${index}" 
              style="padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
        ✕
      </button>
    `;
    hotelPriorityContainer.appendChild(hotelItem);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-hotel-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      const currentList = getHotelPriorityList();
      currentList.splice(index, 1);
      generateHotelPriorityList(currentList);
    });
  });
}

// Generate room priority list UI
function generateRoomPriorityList(roomList = defaultRoomPriorities) {
  roomPriorityContainer.innerHTML = "";

  roomList.forEach((room, index) => {
    const roomItem = document.createElement("div");
    roomItem.className = "priority-item";
    roomItem.style.cssText =
      "display: flex; gap: 10px; margin-bottom: 8px; align-items: center;";
    roomItem.innerHTML = `
      <span style="min-width: 25px; font-weight: bold; color: #667eea;">${index + 1}.</span>
      <input type="text" class="room-priority-input" value="${room}" 
             style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
             placeholder="Enter room name">
      <button type="button" class="remove-room-btn" data-index="${index}" 
              style="padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
        ✕
      </button>
    `;
    roomPriorityContainer.appendChild(roomItem);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-room-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      const currentList = getRoomPriorityList();
      currentList.splice(index, 1);
      generateRoomPriorityList(currentList);
    });
  });
}

// Get current hotel priority list from UI
function getHotelPriorityList() {
  const inputs = document.querySelectorAll(".hotel-priority-input");
  return Array.from(inputs)
    .map((input) => input.value.trim())
    .filter((v) => v);
}

// Get current room priority list from UI
function getRoomPriorityList() {
  const inputs = document.querySelectorAll(".room-priority-input");
  return Array.from(inputs)
    .map((input) => input.value.trim())
    .filter((v) => v);
}

// Add new hotel to priority list
addHotelBtn.addEventListener("click", () => {
  const currentList = getHotelPriorityList();
  currentList.push("");
  generateHotelPriorityList(currentList);
  // Focus on the new input
  const inputs = document.querySelectorAll(".hotel-priority-input");
  if (inputs.length > 0) {
    inputs[inputs.length - 1].focus();
  }
});

// Add new room to priority list
addRoomBtn.addEventListener("click", () => {
  const currentList = getRoomPriorityList();
  currentList.push("");
  generateRoomPriorityList(currentList);
  // Focus on the new input
  const inputs = document.querySelectorAll(".room-priority-input");
  if (inputs.length > 0) {
    inputs[inputs.length - 1].focus();
  }
});

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
      
      <label for="guest${i}_company">Company:</label>
      <input type="text" id="guest${i}_company" placeholder="Optional">
      
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
      if (config.rooms) roomsInput.value = config.rooms;
      if (config.guestsPerRoom) guestsPerRoomInput.value = config.guestsPerRoom;
      if (config.numGuests) numGuestsInput.value = config.numGuests;

      // Load hotel and room priorities
      if (config.hotelPriorities && config.hotelPriorities.length > 0) {
        generateHotelPriorityList(config.hotelPriorities);
      } else {
        generateHotelPriorityList();
      }

      if (config.roomPriorities && config.roomPriorities.length > 0) {
        generateRoomPriorityList(config.roomPriorities);
      } else {
        generateRoomPriorityList();
      }

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
          document.getElementById(`guest${i}_company`).value =
            guest.company || "";
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
    } else {
      // No saved config, use defaults
      generateHotelPriorityList();
      generateRoomPriorityList();
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
      company: document.getElementById(`guest${i}_company`).value,
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
    hotelPriorities: getHotelPriorityList(),
    roomPriorities: getRoomPriorityList(),
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

// Auto-save when user clicks out of popup or closes it
window.addEventListener("blur", () => {
  console.log("Popup lost focus, auto-saving...");
  saveConfig();
});

window.addEventListener("beforeunload", () => {
  console.log("Popup closing, auto-saving...");
  saveConfig();
});

// Initialize
setDefaultDates();
generateGuestForms();
loadConfig();
