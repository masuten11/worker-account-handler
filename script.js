// Cache frequently used DOM elements
const elements = {
  // Worker details section
  workerTableBody: document.querySelector(".worker_table_body"),
  addWorkerBtn: document.querySelector("#add-worker"),
  editWorkerBtn: document.querySelector("#edit-worker"),
  workerInputTitle: document.querySelector(".worker-input-title"),
  workerInputContainer: document.querySelector(".worker_input_container"),

  // Worker input form
  fullNameInput: document.querySelector("#full-name"),
  joinedDateInput: document.querySelector("#joined"),
  addressInput: document.querySelector("#adress"),
  bkashInput: document.querySelector("#bkash"),
  currDueInput: document.querySelector("#curr-due"),
  continueBtn: document.querySelector("#continue"),

  // Weekly account section
  weeklyTable: document.querySelector(".weekly_table"),
  weeklyTbody: document.querySelector("#weekly-tbody"),
  dayRadios: document.querySelectorAll('input[name="Day"]'),
  workerSelect: document.querySelector("#Worker"),
  inputTypeSelect: document.querySelector("#inputType"),
  infoRadios: document.querySelectorAll('input[name="Info"]'),
  dataInput: document.querySelector("#data"),
  doneBtn: document.querySelector("#done")
};

// Initialize the application
function init() {
  // Set up event listeners
  setupEventListeners();

  // Update dates in the weekly table
  updateDates();

  // Add default workers to select dropdown
  populateWorkerSelect();

  // Auto Calculations
  autoCalculate();
}

// Set up all event listeners
function setupEventListeners() {
  // Worker buttons
  elements.addWorkerBtn.addEventListener("click", toggleAddWorkerForm);
  elements.editWorkerBtn.addEventListener("click", toggleEditWorkerForm);
  elements.continueBtn.addEventListener("click", () => {
    handleWorkerFormSubmit();
    autoCalculate();
  });

  // Weekly account buttons
  elements.doneBtn.addEventListener("click", () => {
    handleWeeklyDataUpdate();
    autoCalculate();
  });
  elements.inputTypeSelect.addEventListener("change", handleInputTypeChange);

  // Set today's day as checked by default
  const today = new Date().getDay();
  elements.dayRadios[today].checked = true;
}

// Populate worker select dropdown with default workers
function populateWorkerSelect() {
  const defaultWorkers = [
    { id: "Rafiqul", name: "Rafiqul Islam" },
    { id: "Hasan", name: "Hasan Ali" },
    { id: "Tarek", name: "Tarek Zia" },
    { id: "Riad", name: "Riad Sheikh" }
  ];

  defaultWorkers.forEach(worker => {
    const option = document.createElement("option");
    option.value = worker.id;
    option.textContent = worker.name;
    elements.workerSelect.appendChild(option);
  });
}

// Toggle add worker form visibility
function toggleAddWorkerForm() {
  // Hide current due field for new workers
  elements.currDueInput.style.display = "none";
  document.querySelector('label[for="curr-due"]').style.display = "none";

  // Remove any existing worker select dropdown
  const existingSelect = document.querySelector('#workers-select');
  if (existingSelect) {
    existingSelect.remove();
    document.querySelector('label[for="workers-select"]')?.remove();
  }

  // Toggle visibility
  elements.workerInputTitle.classList.toggle("visible");
  elements.workerInputContainer.classList.toggle("visible");

  // Clear any edit mode classes and set add mode
  elements.workerInputContainer.classList.remove("edit");
  elements.workerInputContainer.classList.add("add");

  // Reset form
  resetWorkerForm();
}

// Toggle edit worker form visibility
function toggleEditWorkerForm() {
  // Show current due field for editing
  elements.currDueInput.style.display = "block";
  document.querySelector('label[for="curr-due"]').style.display = "block";

  // Create worker select dropdown if it doesn't exist
  if (!document.querySelector('#workers-select')) {
    createWorkerSelectDropdown();
  }

  // Toggle visibility
  elements.workerInputTitle.classList.toggle("visible");
  elements.workerInputContainer.classList.toggle("visible");

  // Clear any add mode classes and set edit mode
  elements.workerInputContainer.classList.remove("add");
  elements.workerInputContainer.classList.add("edit");

  // Reset form
  resetWorkerForm();
}

// Create dropdown to select worker for editing
function createWorkerSelectDropdown() {
  const selectElement = document.createElement("select");
  selectElement.id = "workers-select";
  selectElement.name = "workers";
  selectElement.required = true;

  // Get all worker names from the table
  const workers = Array.from(elements.workerTableBody.rows).map(row => ({
    id: row.id,
    name: row.cells[0].textContent.trim()
  }));

  // Add options for each worker
  workers.forEach(worker => {
    const option = document.createElement("option");
    option.value = worker.id;
    option.textContent = worker.name;
    selectElement.appendChild(option);
  });

  // Create label
  const label = document.createElement("label");
  label.textContent = "Select Worker to Edit:";
  label.setAttribute("for", "workers-select");

  // Insert before the first form field
  elements.workerInputContainer.firstElementChild.before(selectElement);
  selectElement.before(label);
  selectElement.after(document.createElement("br"));
  label.after(document.createElement("br"));
}

// Reset worker form fields
function resetWorkerForm() {
  elements.fullNameInput.value = "";
  elements.joinedDateInput.value = "";
  elements.addressInput.value = "";
  elements.bkashInput.value = "";
  elements.currDueInput.value = "";
}

// Handle worker form submission (add/edit)
function handleWorkerFormSubmit() {
  // Validate form inputs
  if (!validateWorkerForm()) {
    return;
  }

  if (elements.workerInputContainer.classList.contains("add")) {
    addNewWorker();
  } else {
    editExistingWorker();
  }

  // Reset form
  resetWorkerForm();
  elements.workerInputContainer.classList.remove("visible");
  elements.workerInputTitle.classList.remove("visible");
}

// Validate worker form inputs
function validateWorkerForm() {
  // Basic validation
  if (!elements.fullNameInput.value.trim()) {
    alert("Please enter worker's name");
    return false;
  }

  if (!elements.joinedDateInput.value) {
    alert("Please select join date");
    return false;
  }

  if (!elements.addressInput.value.trim()) {
    alert("Please enter worker's address");
    return false;
  }

  // Validate Bkash number
  if (!isValidBkashNumber(elements.bkashInput.value.trim())) {
    alert("Please enter a valid Bkash number (11 digits starting with 01)");
    return false;
  }

  // For edit mode, validate current due
  if (elements.workerInputContainer.classList.contains("edit") &&
    !elements.currDueInput.value.trim()) {
    alert("Please enter current due amount");
    return false;
  }

  return true;
}

// Check if Bkash number is valid
function isValidBkashNumber(number) {
  return /^01[3-9]\d{8}$/.test(number);
}

// Add a new worker to both tables
function addNewWorker() {
  const workerId = elements.fullNameInput.value.trim().replace(/\s+/g, '-').toLowerCase();
  const workerName = elements.fullNameInput.value.trim();
  const joinYear = new Date(elements.joinedDateInput.value).getFullYear();

  // Add to worker details table
  const newWorkerRow = elements.workerTableBody.insertRow();
  newWorkerRow.id = workerId;

  newWorkerRow.innerHTML = `
    <td>${workerName}</td>
    <td>${joinYear}-Present</td>
    <td>${elements.addressInput.value.trim()}</td>
    <td>${elements.bkashInput.value.trim()}</td>
    <td>0</td>
  `;

  // Add to weekly table
  const newWeeklyRow = elements.weeklyTbody.insertRow();
  newWeeklyRow.id = workerId;

  const rowNumber = elements.weeklyTbody.rows.length;
  newWeeklyRow.innerHTML = `
    <td>${rowNumber}</td>
    <td>${workerName}</td>
    <td>✖</td>
    <td>✖</td>
    <td>✖</td>
    <td>✖</td>
    <td>✖</td>
    <td>✖</td>
    <td>✖</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
  `;

  // Add to worker select dropdown
  const option = document.createElement("option");
  option.value = workerId;
  option.textContent = workerName;
  elements.workerSelect.appendChild(option);

  alert("Worker added successfully!");
}

// Edit existing worker details
function editExistingWorker() {
  const workerSelect = document.querySelector('#workers-select');
  if (!workerSelect) return;

  const workerId = workerSelect.value;
  const workerName = elements.fullNameInput.value.trim();
  const joinYear = new Date(elements.joinedDateInput.value).getFullYear();

  // Update worker details table
  const workerRow = elements.workerTableBody.querySelector(`#${workerId}`);
  if (workerRow) {
    workerRow.cells[0].textContent = workerName;
    workerRow.cells[1].textContent = `${joinYear}-Present`;
    workerRow.cells[2].textContent = elements.addressInput.value.trim();
    workerRow.cells[3].textContent = elements.bkashInput.value.trim();
    workerRow.cells[4].textContent = elements.currDueInput.value.trim();
  }

  // Update weekly table
  const weeklyRow = elements.weeklyTbody.querySelector(`#${workerId}`);
  if (weeklyRow) {
    weeklyRow.cells[1].textContent = workerName;
  }

  // Update worker select dropdown
  const workerOption = elements.workerSelect.querySelector(`option[value="${workerId}"]`);
  if (workerOption) {
    workerOption.textContent = workerName;
  }

  alert("Worker details updated successfully!");
}

// Handle weekly data updates
function handleWeeklyDataUpdate() {
  // Validate inputs
  if (!validateWeeklyInputs()) {
    return;
  }

  // Update the data
  updateWorkerData();

  // Recalculate totals
  updateAllWorkerTotals();

  // Reset form
  elements.dataInput.value = "";
}

// Validate weekly inputs
function validateWeeklyInputs() {
  const selectedDay = document.querySelector('input[name="Day"]:checked');
  const selectedInfo = document.querySelector('input[name="Info"]:checked');

  if (!selectedDay) {
    alert("Please select a day");
    return false;
  }

  if (!selectedInfo) {
    alert("Please select information to update");
    return false;
  }

  if (!elements.dataInput.value.trim()) {
    alert("Please enter a value");
    return false;
  }

  // Validate numeric input
  if (isNaN(Number(elements.dataInput.value.trim()))) {
    alert("Please enter a valid number");
    return false;
  }

  return true;
}

// Update worker data in weekly table
function updateWorkerData() {
  const selectedWorker = elements.workerSelect.value;
  const selectedDay = document.querySelector('input[name="Day"]:checked').value;
  const operation = elements.inputTypeSelect.value;
  const dataToOperate = document.querySelector('input[name="Info"]:checked').value;
  const dataValue = elements.dataInput.value.trim();

  // Find the worker's row
  const workerRow = elements.weeklyTbody.querySelector(`#${selectedWorker}`);
  if (!workerRow) return;

  // Handle new data operation
  if (operation === "newData") {
    switch (dataToOperate) {
      case "produced-on-day":
        const dayIndex = Array.from(elements.weeklyTable.rows[1].cells).findIndex(
          cell => cell.id === selectedDay
        );
        workerRow.cells[dayIndex].textContent =
          workerRow.cells[dayIndex].textContent === "✖" ?
            dataValue :
            (Number(workerRow.cells[dayIndex].textContent) + Number(dataValue)).toString();
        break;

      case "meal-expense":
        workerRow.cells[12].textContent =
          workerRow.cells[12].textContent === "0" ?
            dataValue :
            (Number(workerRow.cells[12].textContent) + Number(dataValue)).toString();
        break;

      case "worker-deposite":
        workerRow.cells[13].textContent =
          workerRow.cells[13].textContent === "0" ?
            dataValue :
            (Number(workerRow.cells[13].textContent) + Number(dataValue)).toString();
        break;

      case "owner-advance":
        workerRow.cells[14].textContent =
          workerRow.cells[14].textContent === "0" ?
            dataValue :
            (Number(workerRow.cells[14].textContent) + Number(dataValue)).toString();
        break;
    }
  }
  // Handle edit data operation
  else if (operation === "editData") {
    switch (dataToOperate) {
      case "produced-on-day":
        const dayIndex = Array.from(elements.weeklyTable.rows[1].cells).findIndex(
          cell => cell.id === selectedDay
        );
        workerRow.cells[dayIndex].textContent = dataValue;
        break;

      case "meal-expense":
        workerRow.cells[12].textContent = dataValue;
        break;

      case "worker-deposite":
        workerRow.cells[13].textContent = dataValue;
        break;

      case "owner-advance":
        workerRow.cells[14].textContent = dataValue;
        break;

      case "total-work":
        workerRow.cells[9].textContent = dataValue;
        break;

      case "total-bill":
        workerRow.cells[11].textContent = dataValue;
        break;
    }
  }

  // Always allow work rate update
  if (dataToOperate === "work-rate") {
    workerRow.cells[10].textContent = dataValue;
  }
}

// Handle input type change (enable/disable total fields)
function handleInputTypeChange() {
  const isNewData = elements.inputTypeSelect.value === "newData";

  // Find total work and total bill radio buttons
  const totalWorkRadio = document.querySelector('#total-work');
  const totalBillRadio = document.querySelector('#total-bill');

  // Disable/enable based on selection
  totalWorkRadio.disabled = isNewData;
  totalBillRadio.disabled = isNewData;

  // Visual feedback
  const opacity = isNewData ? "0.5" : "1";
  totalWorkRadio.style.opacity = opacity;
  totalBillRadio.style.opacity = opacity;
  document.querySelector('label[for="total-work"]').style.opacity = opacity;
  document.querySelector('label[for="total-bill"]').style.opacity = opacity;

  // Uncheck if disabled
  if (isNewData) {
    totalWorkRadio.checked = false;
    totalBillRadio.checked = false;
  }
}

// Calculate total work and bill for a worker
function calculateWorkerTotals(rowIndex) {
  const row = elements.weeklyTbody.rows[rowIndex];
  if (!row) return;

  // Calculate total work (sum of daily production)
  let totalWork = 0;
  for (let i = 2; i < 9; i++) {
    const dayValue = row.cells[i].textContent;
    if (dayValue !== "✖" && !isNaN(dayValue)) {
      totalWork += Number(dayValue);
    }
  }
  row.cells[9].textContent = totalWork.toString();

  // Calculate total bill (total work * work rate)
  const workRate = Number(row.cells[10].textContent);
  if (workRate > 0) {
    const totalBill = totalWork * workRate;
    row.cells[11].textContent = totalBill.toFixed(0);
  }
}

// Update totals for all workers
function updateAllWorkerTotals() {
  for (let i = 0; i < elements.weeklyTbody.rows.length; i++) {
    calculateWorkerTotals(i);
  }
}

// Update dates in the weekly table
function updateDates() {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day

  // Update year and month
  elements.weeklyTable.rows[0].cells[14].textContent = today.getFullYear();

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  elements.weeklyTable.rows[0].cells[13].textContent = monthNames[today.getMonth()];

  // Update dates for each day of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0].slice(5); // MM-DD format
    elements.weeklyTable.rows[0].cells[2 + i].textContent = formattedDate;
  }
}

// Function to handle auto calculation
function autoCalculate() {
  Array.from(elements.weeklyTbody.rows).forEach(row => {
    const mealExpense = Number(row.cells[12].innerText) || 0;
    const ownersAdvance = Number(row.cells[14].innerText) || 0;
    const currentBil = Number(row.cells[11].innerText) || 0;
    const workersDeposite = Number(row.cells[13].innerText) || 0;

    // Calculate adjusted bill
    const adjustedBill = (currentBil - (mealExpense + ownersAdvance)) + workersDeposite;
    row.cells[11].innerText = adjustedBill.toFixed(0);

    // Update due in workerTable
    const rowId = row.getAttribute("id");
    const correspondingRow = elements.workerTableBody.querySelector(`tr[id="${rowId}"]`);
    if (correspondingRow) {
      correspondingRow.cells[4].innerText = adjustedBill.toFixed(0);
    }
  });
}



// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Submit worker form on Enter key
[elements.fullNameInput, elements.joinedDateInput, elements.addressInput,
  elements.bkashInput, elements.currDueInput].forEach(input => {
   input.addEventListener("keydown", function (e) {
     if (e.key === "Enter") {
       e.preventDefault();
       handleWorkerFormSubmit();
       autoCalculate();
     }
   });
 });
 
 // Submit weekly data on Enter key
 elements.dataInput.addEventListener("keydown", function (e) {
   if (e.key === "Enter") {
     e.preventDefault();
     handleWeeklyDataUpdate();
     autoCalculate();
   }
 });
 
