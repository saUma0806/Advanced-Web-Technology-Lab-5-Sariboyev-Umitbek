// Registan Travel - booking page logic (no database: everything stays in the browser)
const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tourSelect = document.getElementById("tour");
const travellersInput = document.getElementById("travellers");
const dateInput = document.getElementById("date");
const totalBox = document.getElementById("total");
const message = document.getElementById("message");

const DISCOUNT_FROM = 5;   // groups of 5 or more
const DISCOUNT = 0.10;     // 10% off

// Disable past dates in the calendar
dateInput.min = new Date().toISOString().split("T")[0];

// Returns { text, total } for the current tour + travellers
function calculate() {
  const price = Number(tourSelect.selectedOptions[0].dataset.price);
  const people = parseInt(travellersInput.value, 10);

  if (!price) return { text: "Total: choose a tour", total: 0 };
  if (!people || people < 1 || people > 12) {
    return { text: "Total: enter 1 to 12 travellers", total: 0 };
  }

  const subtotal = people * price;
  if (people >= DISCOUNT_FROM) {
    const total = subtotal * (1 - DISCOUNT);
    return {
      text: `Total: ${people} × ${price} USD = ${subtotal} USD − 10% group discount = ${total} USD`,
      total
    };
  }
  return { text: `Total: ${people} × ${price} USD = ${subtotal} USD`, total: subtotal };
}

function updateTotal() {
  totalBox.textContent = calculate().text;
}

function showMessage(type, text) {
  message.className = type;     // "error" or "success"
  message.textContent = text;   // textContent: user input is never run as HTML
}

tourSelect.addEventListener("change", updateTotal);
travellersInput.addEventListener("input", updateTotal);
travellersInput.addEventListener("change", updateTotal);

form.addEventListener("submit", function (event) {
  event.preventDefault();       // no page reload

  nameInput.classList.remove("invalid");
  emailInput.classList.remove("invalid");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const errors = [];

  if (name === "") {
    nameInput.classList.add("invalid");
    errors.push("Please enter your name.");
  }
  if (!email.includes("@")) {
    emailInput.classList.add("invalid");
    errors.push("Please enter a valid email (it must contain @).");
  }
  if (errors.length > 0) {
    showMessage("error", errors.join(" "));
    return;
  }

  const result = calculate();
  showMessage(
    "success",
    `Thank you, ${name}! Your request is confirmed. ` +
    (result.total ? `Total: ${result.total} USD.` : "We will contact you about the price.")
  );
});
