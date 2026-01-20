// Quick Hotel Booker - Content Script
// Handles automation on the booking website

console.log("Quick Hotel Booker: Content script loaded");

const AUTO_START_FLAG = "qhbAutoStart";
let config = null;
let automationActive = false;

const shouldAutoStart = sessionStorage.getItem(AUTO_START_FLAG) === "true";
if (shouldAutoStart) {
  console.log("Auto-start flag found; resuming automation on this page");
  loadConfigAndStart();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startAutomation") {
    sessionStorage.setItem(AUTO_START_FLAG, "true");
    loadConfigAndStart();
    sendResponse({ success: true });
  }
  return true;
});

// Load configuration and start automation
async function loadConfigAndStart() {
  try {
    if (automationActive) {
      console.log("Automation already active on this page; skipping re-run");
      return;
    }

    const result = await chrome.storage.local.get(["bookingConfig"]);

    // const result = await chrome.storage.local.get([
    //   "bookingConfig",
    //   "automationPaused",
    // ]);

    // // Check if automation is paused
    // if (result.automationPaused) {
    //   console.log("Automation is paused; skipping execution");
    //   return;
    // }

    if (!result.bookingConfig) {
      alert("Please configure your booking details first!");
      sessionStorage.removeItem(AUTO_START_FLAG);
      return;
    }

    config = result.bookingConfig;
    automationActive = true;

    // Determine which page we're on and execute appropriate automation
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);

    const pageType = detectCurrentPage(currentUrl);
    console.log("Detected page:", pageType || "unknown");

    switch (pageType) {
      case "selectTime":
        handleSelectTimePage();
        break;
      case "welcome":
        handleWelcomePage();
        break;
      case "selectHotel":
        handleSelectHotelPage();
        break;
      case "selectRoom":
        handleSelectRoomPage();
        break;
      case "guestInfo":
        handleGuestInfoPage();
        break;
      case "payment":
        handlePaymentPage();
        break;
      default:
        console.warn(
          "Could not detect page type. Please open the welcome or select-time page and click Start again.",
        );
        automationActive = false;
        break;
    }
  } catch (error) {
    console.error("Error loading configuration:", error);
    alert("Error loading configuration: " + error.message);
  }
}

function detectCurrentPage(currentUrl) {
  const checkInElements = document.querySelector(
    '#check-in-date, #check-out-date, #checkIn, #checkOut, input[name="checkIn"], input[name="checkOut"], input[id*="check-in"], input[id*="checkout"], input[id*="check-out"], input[class*="check-in"], input[class*="check-out"], .holder.calendar, #checkin-datepicker, #checkout-datepicker',
  );

  // if (checkInElements) {
  //   return "selectTime";
  // }

  if (currentUrl.includes("/landing")) {
    return "selectTime";
  }

  if (
    document.querySelector('select[name="attendeeType"], select#groupTypeId')
  ) {
    return "welcome";
  }

  if (currentUrl.includes("/list/hotels")) {
    return "selectHotel";
  }

  if (
    currentUrl.includes("/rooms/list") ||
    currentUrl.includes("/rooms/select")
  ) {
    return "selectRoom";
  }

  if (currentUrl.includes("/guest/info")) {
    return "guestInfo";
  }

  if (currentUrl.includes("guest/payment")) {
    return "payment";
  }

  return null;
}

// Page 1: Welcome Page - Select attendee type and click Make Reservation
function handleWelcomePage() {
  console.log("=== WELCOME PAGE AUTOMATION STARTED ===");

  try {
    // Find the attendee type dropdown
    console.log("Searching for attendee type dropdown...");
    const attendeeSelect =
      document.querySelector('select[name="attendeeType"]') ||
      document.querySelector("select#attendeeType") ||
      document.querySelector("select");

    if (attendeeSelect) {
      console.log("✓ Found attendee dropdown:", attendeeSelect);
      console.log("  Available options:", attendeeSelect.options.length);
      for (let i = 0; i < attendeeSelect.options.length; i++) {
        console.log(`    [${i}] ${attendeeSelect.options[i].text}`);
      }

      // Select the first option (1 - FAN)
      attendeeSelect.selectedIndex = 1; // Index 0 is usually "Select", 1 is first real option
      console.log("✓ Selected option:", attendeeSelect.options[1].text);

      // Trigger change event
      attendeeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      console.log("✓ Triggered change event");

      setTimeout(() => {
        // Find and click the Make Reservation button
        console.log("Searching for Make Reservation button...");
        const makeResBtn = Array.from(
          document.querySelectorAll('button, input[type="submit"], a'),
        ).find(
          (el) =>
            el.textContent.includes("Make") ||
            el.textContent.includes("reservation") ||
            el.value?.includes("Make"),
        );

        if (makeResBtn) {
          console.log("✓ Found Make Reservation button:", makeResBtn);
          console.log("✓ Clicking Make Reservation button");
          makeResBtn.click();
          console.log("=== WELCOME PAGE COMPLETED ===");
        } else {
          console.error("✗ Could not find Make Reservation button");
          console.log(
            "Available buttons:",
            document.querySelectorAll('button, input[type="submit"], a'),
          );
          alert("Could not find Make Reservation button");
        }
      }, 500);
    } else {
      console.error("✗ Could not find attendee type dropdown");
      console.log("Available selects:", document.querySelectorAll("select"));
      alert("Could not find attendee type dropdown");
    }
  } catch (error) {
    console.error("✗ ERROR on welcome page:", error);
    console.error("Stack trace:", error.stack);
    alert("Error: " + error.message);
  }
}

// Page 2: Select Time - skip automation per user request
function handleSelectTimePage() {
  console.log("=== SELECT TIME PAGE SKIPPED BY REQUEST ===");
  console.log(
    "Waiting for user to proceed to next page. Automation will resume on next page load.",
  );
}

// Page 3: Select Hotel - Find and select configured hotel
function handleSelectHotelPage() {
  console.log("=== SELECT HOTEL PAGE AUTOMATION STARTED ===");

  try {
    const hotelPriorities = config?.hotelPriorities || ["Kawada Hotel"];
    console.log("Hotel priorities:", hotelPriorities);

    // Look for hotel cards/items
    console.log("Searching for hotel elements...");
    const hotelElements = document.querySelectorAll(
      ".hotel-item, .hotel-card, [data-hotel-name], .hotel",
    );
    console.log("Found", hotelElements.length, "potential hotel elements");

    let targetHotel = null;
    let matchedHotelName = null;

    // Try each hotel in priority order
    for (const priorityHotelName of hotelPriorities) {
      const targetHotelName = priorityHotelName.toLowerCase();
      console.log(`Searching for priority hotel: "${priorityHotelName}"...`);

      // Search hotel elements
      for (const hotel of hotelElements) {
        const hotelText = (
          hotel.textContent ||
          hotel.innerText ||
          ""
        ).toLowerCase();
        if (hotelText.includes(targetHotelName)) {
          targetHotel = hotel;
          matchedHotelName = priorityHotelName;
          console.log(
            `✓ Found priority hotel: "${priorityHotelName}" in hotel elements`,
          );
          break;
        }
      }

      if (targetHotel) break;

      // If not found by class, search all text
      console.log(`Searching all elements for '${targetHotelName}'...`);
      const allElements = document.querySelectorAll("*");
      for (const el of allElements) {
        const text = (el.textContent || el.innerText || "").toLowerCase();
        if (text.includes(targetHotelName)) {
          targetHotel = el.closest("div, li, article, section") || el;
          matchedHotelName = priorityHotelName;
          console.log(
            `✓ Found priority hotel: "${priorityHotelName}" in general search`,
          );
          break;
        }
      }

      if (targetHotel) break;
    }

    if (targetHotel) {
      console.log(`✓ Target hotel found: "${matchedHotelName}"`);

      // Find the Select button within the hotel element
      const selectBtn =
        Array.from(
          targetHotel.querySelectorAll(
            'button, a.select, input[type="submit"], a',
          ),
        ).find((el) => {
          const text = (el.textContent || el.value || "").toLowerCase();
          const visible =
            el.offsetHeight > 0 &&
            el.offsetWidth > 0 &&
            el.getClientRects().length > 0;
          return text.includes("select") && !el.disabled && visible;
        }) ||
        targetHotel.querySelector('button, a.select, input[type="submit"]');

      if (selectBtn) {
        console.log("✓ Found Select button:", selectBtn);
        console.log("✓ Clicking Select button in 500ms");
        setTimeout(() => {
          selectBtn.scrollIntoView({ behavior: "smooth", block: "center" });
          selectBtn.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            }),
          );
          console.log("=== SELECT HOTEL PAGE COMPLETED ===");
        }, 500);
      } else {
        console.error("✗ Found target hotel but could not find Select button");
        console.log(
          "Buttons in hotel element:",
          targetHotel.querySelectorAll("button, a"),
        );
        alert(
          "Found the hotel but could not find Select button. Please click it manually.",
        );
        targetHotel.scrollIntoView({ behavior: "smooth", block: "center" });
        targetHotel.style.border = "3px solid red";
      }
    } else {
      console.error(
        `✗ Could not find any hotels from priority list: ${hotelPriorities.join(", ")}`,
      );
      console.log("Available hotels:");
      hotelElements.forEach((el, i) => {
        console.log(`  [${i}]`, el.textContent.substring(0, 100));
      });
      alert(
        "Could not find any hotels from your priority list. Please select a hotel manually and the automation will continue.",
      );
    }
  } catch (error) {
    console.error("✗ ERROR on select hotel page:", error);
    console.error("Stack trace:", error.stack);
    alert("Error: " + error.message);
  }
}

// Page 4: Select Room - Find and select room from priority list
function handleSelectRoomPage() {
  console.log("=== SELECT ROOM PAGE AUTOMATION STARTED ===");

  try {
    const roomPriorities = config?.roomPriorities || ["Twin Beds"];
    console.log("Room priorities:", roomPriorities);

    // Look for room cards/items
    console.log("Searching for room elements...");
    const roomElements = document.querySelectorAll(
      ".room-item, .room-card, [data-room-type], .room, li",
    );
    console.log("Found", roomElements.length, "potential room elements");

    let targetRoom = null;
    let matchedRoomName = null;

    // Try each room in priority order
    for (const priorityRoomName of roomPriorities) {
      const targetRoomName = priorityRoomName.toLowerCase();
      console.log(`Searching for priority room: "${priorityRoomName}"...`);

      // Search for configured room name
      for (const room of roomElements) {
        const roomText = (
          room.textContent ||
          room.innerText ||
          ""
        ).toLowerCase();
        if (roomText.includes(targetRoomName)) {
          targetRoom = room;
          matchedRoomName = priorityRoomName;
          console.log(`✓ Found priority room: "${priorityRoomName}"`);
          console.log("  Room text:", roomText.substring(0, 100));
          break;
        }
      }

      if (targetRoom) break;
    }

    if (targetRoom) {
      console.log(`✓ Target room found: "${matchedRoomName}"`);

      // Find the Select button within the room element
      const selectBtn =
        // Prefer visible elements whose label includes "select"
        Array.from(
          targetRoom.querySelectorAll(
            'button, a.select, input[type="submit"], a',
          ),
        ).find((el) => {
          const text = (el.textContent || el.value || "").toLowerCase();
          const visible =
            el.offsetHeight > 0 &&
            el.offsetWidth > 0 &&
            el.getClientRects().length > 0;
          const isClose =
            text.includes("close") ||
            el.getAttribute("aria-label")?.toLowerCase().includes("close");
          return text.includes("select") && !el.disabled && visible && !isClose;
        }) ||
        // Fallback: any button within the room card (visible & enabled)
        Array.from(targetRoom.querySelectorAll("button, a")).find((el) => {
          const visible =
            el.offsetHeight > 0 &&
            el.offsetWidth > 0 &&
            el.getClientRects().length > 0;
          return !el.disabled && visible;
        });

      if (selectBtn) {
        console.log("✓ Found Select button:", selectBtn);
        console.log("✓ Clicking Select button in 500ms");
        setTimeout(() => {
          selectBtn.scrollIntoView({ behavior: "smooth", block: "center" });
          selectBtn.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            }),
          );
          console.log("=== SELECT ROOM PAGE COMPLETED ===");
        }, 500);
      } else {
        console.error("✗ Found target room but could not find Select button");
        console.log(
          "Buttons in room element:",
          targetRoom.querySelectorAll("button, a"),
        );
        alert(
          "Found the room but could not find Select button. Please click it manually.",
        );
        targetRoom.scrollIntoView({ behavior: "smooth", block: "center" });
        targetRoom.style.border = "3px solid red";
      }
    } else {
      console.error(
        `✗ Could not find any rooms from priority list: ${roomPriorities.join(", ")}`,
      );
      console.log("Available rooms:");
      roomElements.forEach((el, i) => {
        const text = (el.textContent || el.innerText).substring(0, 100);
        if (text.trim()) {
          console.log(`  [${i}]`, text);
        }
      });
      alert(
        "Could not find any rooms from your priority list. Please select a room manually and the automation will continue.",
      );
    }
  } catch (error) {
    console.error("✗ ERROR on select room page:", error);
    console.error("Stack trace:", error.stack);
    alert("Error: " + error.message);
  }
}

// Page 5: Guest Information - Fill in guest details
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function handleGuestInfoPage() {
  console.log("=== GUEST INFO PAGE AUTOMATION STARTED ===");

  try {
    if (!config.guests || config.guests.length === 0) {
      console.error("✗ No guest information found in configuration!");
      alert("No guest information found in configuration!");
      return;
    }

    console.log(`Filling information for ${config.guests.length} guest(s)`);

    // Fill in information for each guest
    for (const [index, guest] of config.guests.entries()) {
      const guestNum = index + 1;
      console.log(`\n--- Guest ${guestNum} ---`);

      // If this is guest 2 or higher, click "Add Adult" button first
      if (guestNum > 1) {
        console.log(`  Clicking 'Add Adult' button for guest ${guestNum}...`);
        const addAdultBtn = Array.from(
          document.querySelectorAll('button, a, input[type="button"]'),
        ).find(
          (el) =>
            el.textContent.toLowerCase().includes("add adult") ||
            el.textContent.toLowerCase().includes("add guest"),
        );

        if (addAdultBtn) {
          console.log(`  ✓ Found Add Adult button`);
          addAdultBtn.click();
          const waitTime = 800;
          console.log(`  Waiting ${waitTime}ms for form to render...`);
          await sleep(waitTime);
          console.log(`  ✓ Form should be ready`);

          // Debug: Log all input fields to see what names/ids they have
          console.log(`  DEBUG: Checking all input fields after Add Adult...`);
          const allInputs = document.querySelectorAll("input, select");
          console.log(`  Total inputs/selects: ${allInputs.length}`);
          allInputs.forEach((inp) => {
            const name = inp.getAttribute("name");
            const id = inp.getAttribute("id");
            const placeholder = inp.getAttribute("placeholder");
            if (
              name?.includes("2") ||
              id?.includes("2") ||
              name?.includes("guest") ||
              id?.includes("guest")
            ) {
              console.log(
                `    Found: name="${name}" id="${id}" type="${inp.type}" placeholder="${placeholder}"`,
              );
            }
          });
        } else {
          console.warn(
            `  ✗ Could not find Add Adult button for guest ${guestNum}`,
          );
        }
      }

      // First Name
      fillField(
        [
          `reservations0.guests${index}.firstName`,
          `reservations[0].guests[${index}].firstName`,
        ],
        guest.firstName,
        `Guest ${guestNum} First Name`,
      );

      // Last Name
      fillField(
        [
          `reservations0.guests${index}.lastName`,
          `reservations[0].guests[${index}].lastName`,
        ],
        guest.lastName,
        `Guest ${guestNum} Last Name`,
      );

      // Email
      fillField(
        [
          `reservations0.guests${index}.email`,
          `reservations[0].guests[${index}].email`,
        ],
        guest.email,
        `Guest ${guestNum} Email`,
      );

      // Confirm Email
      fillField(
        [
          `reservations0.guests${index}.confirmEmail`,
          `reservations[0].guests[${index}].confirmEmail`,
        ],
        guest.email,
        `Guest ${guestNum} Confirm Email`,
      );

      // Company
      fillField(
        [
          `reservations0.guests${index}.organization`,
          `reservations[0].guests[${index}].organization`,
        ],
        guest.company,
        `Guest ${guestNum} Company`,
      );

      // Phone (note: field is phoneNumber)
      fillField(
        [
          `reservations0.guests${index}.phoneNumber`,
          `reservations[0].guests[${index}].phoneNumber`,
        ],
        guest.phone,
        `Guest ${guestNum} Phone`,
      );

      // Address (note: field is address.address1)
      fillField(
        [
          `reservations0.guests${index}.address.address1`,
          `reservations[0].guests[${index}].address.address1`,
        ],
        guest.address,
        `Guest ${guestNum} Address`,
      );

      // City (note: field is address.city)
      fillField(
        [
          `reservations0.guests${index}.address.city`,
          `reservations[0].guests[${index}].address.city`,
        ],
        guest.city,
        `Guest ${guestNum} City`,
      );

      // State (note: field is address.state)
      fillField(
        [
          `reservations0.guests${index}.address.state`,
          `reservations[0].guests[${index}].address.state`,
        ],
        guest.state,
        `Guest ${guestNum} State`,
      );

      // ZIP (note: field is address.zip)
      fillField(
        [
          `reservations0.guests${index}.address.zip`,
          `reservations[0].guests[${index}].address.zip`,
        ],
        guest.zip,
        `Guest ${guestNum} ZIP`,
      );

      // Country (note: field is address.country.alpha2Code)
      fillField(
        [
          `reservations0.guests${index}.address.country.alpha2Code`,
          `reservations[0].guests[${index}].address.country.alpha2Code`,
        ],
        guest.country,
        `Guest ${guestNum} Country`,
      );
    }

    setTimeout(() => {
      // Click Next button
      console.log("\n--- Searching for Next button ---");
      const allButtons = document.querySelectorAll(
        'button, input[type="submit"]',
      );
      console.log(`  Total buttons found: ${allButtons.length}`);
      allButtons.forEach((btn, i) => {
        const visible =
          btn.offsetHeight > 0 &&
          btn.offsetWidth > 0 &&
          btn.getClientRects().length > 0;
        console.log(
          `    [${i}] type="${btn.type}" text="${btn.textContent || btn.value}" visible=${visible} disabled=${btn.disabled}`,
        );
      });

      const candidates = Array.from(allButtons).filter(
        (el) =>
          (el.textContent.includes("Next") ||
            el.value?.includes("Next") ||
            el.textContent.includes("Continue")) &&
          !el.disabled,
      );

      const visibleCandidate = candidates.find(
        (el) =>
          el.offsetHeight > 0 &&
          el.offsetWidth > 0 &&
          el.getClientRects().length > 0,
      );

      const nextBtn = visibleCandidate || candidates[0];

      if (nextBtn) {
        console.log(
          "✓ Found Next button:",
          nextBtn.textContent || nextBtn.value,
          "visible=",
          nextBtn.offsetHeight > 0 && nextBtn.offsetWidth > 0,
          "disabled=",
          nextBtn.disabled,
        );
        console.log("✓ About to click Next button (scrolling into view)");
        nextBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        // Use a real click event to mimic user interaction
        nextBtn.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
        console.log("✓ Clicked Next button");
        console.log("=== GUEST INFO PAGE COMPLETED ===");
      } else {
        console.error("✗ Could not find Next button");
        console.log("Available buttons:");
        document
          .querySelectorAll('button, input[type="submit"]')
          .forEach((btn, i) => {
            console.log(`  [${i}] ${btn.textContent || btn.value}`);
          });
        alert(
          "Guest information filled. Please click Next button manually to continue.",
        );
      }
    }, 1000);
  } catch (error) {
    console.error("✗ ERROR on guest info page:", error);
    console.error("Stack trace:", error.stack);
    alert("Error filling guest information: " + error.message);
  }
}

// Page 6: Payment Information - Fill in payment details
function handlePaymentPage() {
  console.log("=== PAYMENT PAGE AUTOMATION STARTED ===");

  try {
    if (!config.payment) {
      console.error("✗ No payment information found in configuration!");
      alert("No payment information found in configuration!");
      return;
    }

    const payment = config.payment;
    console.log("Filling payment information...\n");

    // Debug: Log all input fields to see what names/ids they have
    console.log("DEBUG: Checking all input fields on payment page...");
    const allInputs = document.querySelectorAll("input, select");
    console.log(`Total inputs/selects: ${allInputs.length}`);
    allInputs.forEach((inp, i) => {
      const name = inp.getAttribute("name");
      const id = inp.getAttribute("id");
      const placeholder = inp.getAttribute("placeholder");
      const type = inp.getAttribute("type");
      console.log(
        `  [${i}] name="${name}" id="${id}" type="${type}" placeholder="${placeholder}" tag=${inp.tagName}`,
      );
      if (
        name?.includes("card") ||
        id?.includes("card") ||
        name?.includes("cc") ||
        id?.includes("cc") ||
        name?.includes("number") ||
        id?.includes("number") ||
        name?.includes("exp") ||
        id?.includes("exp") ||
        placeholder?.toLowerCase()?.includes("card") ||
        placeholder?.toLowerCase()?.includes("exp")
      ) {
        console.log(
          `    * CARD-RELATED FIELD * name="${name}" id="${id}" type="${type}" placeholder="${placeholder}"`,
        );
      }
    });

    // Card Number
    fillField(
      ["cardNumber", "card_number", "creditCardNumber", "cc_number", "number"],
      payment.cardNumber,
      "Card Number",
    );

    // Expiration Month
    fillField(
      [
        "cardMonth",
        "expMonth",
        "exp_month",
        "expiryMonth",
        "month",
        "billingInfo0.payment.creditCard.expirationMonth",
        "billingInfo[0].payment.creditCard.expirationMonth",
      ],
      payment.cardMonth,
      "Expiration Month",
    );

    // Expiration Year
    fillField(
      [
        "cardYear",
        "expYear",
        "exp_year",
        "expiryYear",
        "year",
        "billingInfo0.payment.creditCard.expirationYear",
        "billingInfo[0].payment.creditCard.expirationYear",
      ],
      payment.cardYear,
      "Expiration Year",
    );

    // CVV
    fillField(
      [
        "cvv",
        "cvc",
        "securityCode",
        "cvv2",
        "billingInfo0.payment.creditCard.cvv",
        "billingInfo[0].payment.creditCard.cvv",
      ],
      payment.cvv,
      "CVV",
    );

    // Billing Address
    fillField(
      ["billingAddress", "billing_address", "address", "street"],
      payment.billingAddress,
      "Billing Address",
    );

    // Billing City
    fillField(
      ["billingCity", "billing_city", "city"],
      payment.billingCity,
      "Billing City",
    );

    // Billing State
    fillField(
      ["billingState", "billing_state", "state"],
      payment.billingState,
      "Billing State",
    );

    // Billing ZIP
    fillField(
      ["billingZip", "billing_zip", "zip", "postalCode", "postal_code"],
      payment.billingZip,
      "Billing ZIP",
    );

    // Billing Country
    fillField(
      ["billingCountry", "billing_country", "country"],
      payment.billingCountry,
      "Billing Country",
    );

    console.log("=== PAYMENT PAGE COMPLETED ===");
    console.log("⚠️  PLEASE REVIEW AND SUBMIT MANUALLY");
    // alert(
    //   "Payment information filled. Please review and submit the form manually.",
    // );
  } catch (error) {
    console.error("✗ ERROR on payment page:", error);
    console.error("Stack trace:", error.stack);
    alert("Error filling payment information: " + error.message);
  }
}

// Helper function to fill a field by trying multiple selectors
function fillField(selectors, value, fieldLabel) {
  if (!value) {
    console.warn(`⚠️  Skipping ${fieldLabel || "field"}: no value provided`);
    return false;
  }

  for (const selector of selectors) {
    let field = null;

    // Try by exact name attribute (handles bracket notation in HTML)
    field = document.querySelector(`[name="${selector}"]`);

    // Try by id attribute (only if selector has no brackets, since brackets break #id selectors)
    if (!field && !selector.includes("[") && !selector.includes("]")) {
      const escapedId = CSS && CSS.escape ? CSS.escape(selector) : selector;
      field = document.querySelector(`#${escapedId}`);
    }

    // Try by name containing (for partial matches, skip if selector has brackets)
    if (!field && !selector.includes("[")) {
      field = document.querySelector(`[name*="${selector}"]`);
    }

    if (field) {
      // Special handling for select dropdowns
      if (field.tagName === "SELECT") {
        console.log(`  Found SELECT for ${fieldLabel}:`, selector);
        console.log(`    Available options: ${field.options.length}`);
        let foundOption = false;

        // Try to find option by value or text
        for (let i = 0; i < field.options.length; i++) {
          const optText = field.options[i].text.toLowerCase();
          const optValue = field.options[i].value.toLowerCase();
          const searchValue = value.toLowerCase();

          if (optText.includes(searchValue) || optValue.includes(searchValue)) {
            console.log(
              `    ✓ Found matching option [${i}]: ${field.options[i].text}`,
            );
            field.selectedIndex = i;
            foundOption = true;
            break;
          }
        }

        if (!foundOption && field.options.length > 1) {
          // If no exact match, try first non-empty option
          console.log(
            `    No exact match found; selecting first option (index 1)`,
          );
          field.selectedIndex = 1;
          foundOption = true;
        }

        if (foundOption) {
          field.dispatchEvent(new Event("change", { bubbles: true }));
          field.dispatchEvent(new Event("blur", { bubbles: true }));
          console.log(
            `✓ ${fieldLabel || "Field"}: ${selector} = ${field.options[field.selectedIndex].text}`,
          );
          return true;
        }
      } else {
        // Regular input field
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
        console.log(`✓ ${fieldLabel || "Field"}: ${selector} = ${value}`);
        return true;
      }
    }
  }

  console.warn(
    `✗ ${fieldLabel || "Field"} not found. Tried selectors:`,
    selectors,
  );
  return false;
}

// Auto-detect page changes and continue automation
window.addEventListener("load", () => {
  // const shouldAutoStart = sessionStorage.getItem(AUTO_START_FLAG) === "true";
  // if (shouldAutoStart && !automationActive) {
  //   console.log("Load event fired; auto-starting automation");
  //   loadConfigAndStart();
  // }
});

// Create floating button for easy automation start
function createFloatingButton() {
  // Check if button already exists
  if (document.getElementById("qhb-floating-btn")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "qhb-floating-btn";
  button.innerHTML = "🚀 Start Booking";
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Hover effect
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-2px)";
    button.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0)";
    button.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
  });

  // Click handler
  button.addEventListener("click", () => {
    console.log("Floating button clicked, starting automation...");
    sessionStorage.setItem(AUTO_START_FLAG, "true");
    loadConfigAndStart();

    // Visual feedback
    button.innerHTML = "✅ Started!";
    button.style.background =
      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";
    setTimeout(() => {
      button.innerHTML = "🚀 Start Booking";
      button.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }, 2000);
  });

  document.body.appendChild(button);
  console.log("Floating button created");
}

// Create floating button when page loads (only on booking pages)
if (
  window.location.href.includes("book.passkey.com") ||
  window.location.href.includes("passkey")
) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFloatingButton);
  } else {
    createFloatingButton();
  }
}

console.log("Quick Hotel Booker: Ready for automation");
