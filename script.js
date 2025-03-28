// Selecting HTML elements
const workerInpContainer = document.querySelector(".worker_input_container");
const weeklyTable = document.querySelector(".weekly_table");
const selectElement = document.querySelector("#inputType");
const weeklyTbody = document.querySelector("#weekly-tbody");
const doneButt = document.querySelector("#done");


// Adding Event Listener to the #edit-worker & #add-worker Buttons
//
const addWorkerButt = document.querySelector("#add-worker");
const editWorkerButt = document.querySelector("#edit-worker");
const workerInpTitle = document.querySelector(".worker-input-title");

// Hidding #curr-due and Unhidding workerInpts
addWorkerButt.addEventListener("click", () => {
  document.querySelector("#curr-due").style.setProperty("display", "none");
  document.querySelector(`label[for="curr-due"]`).style.setProperty("display", "none");

  workerInpTitle.classList.toggle("visible");
  workerInpContainer.classList.toggle("visible");
  if (workerInpContainer.classList.contains("edit")) workerInpContainer.classList.remove("edit");
  workerInpContainer.classList.toggle("add");
});

// unhidding #curr-due workerInpts
editWorkerButt.addEventListener("click", () => {
  document.querySelector("#curr-due").style.setProperty("display", "block");
  document.querySelector(`label[for="curr-due"]`).style.setProperty("display", "block");

  workerInpTitle.classList.toggle("visible");
  workerInpContainer.classList.toggle("visible");
  if (workerInpContainer.classList.contains("add")) workerInpContainer.classList.remove("add");
  workerInpContainer.classList.toggle("edit");
});


// Function to Update Data After Adding or Editing Workers
//
const workerTableBody = document.querySelector(".worker_table_body");
const workerName = document.querySelector("#full-name");
const joinedDate = document.querySelector("#joined");
const workerAdress = document.querySelector("#bkash");
const bkashNum = document.querySelector("#bkash");
try {
  const currDue = document.querySelector("#curr-due");
} catch (error) { console.error(error) };

function addNewWorker() {
  // Validating Conditions to Continue
  if (workerInpContainer.classList.contains("visible") && workerInpContainer.classList.contains("add") & workerName.value.trim() !== "" && workerAdress.value.trim() !== "" && bkashNum.value.trim() !== "") {
    // Creating New Rows and Cells for the Workers Table
    let newRow = document.createElement("tr");
    for (let i = 0; i < 5; i++) {
      const newCell = document.createElement("td");
      newRow.appendChild(newCell);
    }
    // Adding Textcontents to the Each Cell
    newRow.cells[0].textContent = workerName.value.trim();
    newRow.cells[1].textContent = joinedDate.value.split("-")[0];
    newRow.cells[2].textContent = workerAdress.value.trim();
    newRow.cells[3].textContent = bkashNum.value.trim();
    newRow.cells[4].textContent = 0;

    // Appending the row on the worker details table
    workerTableBody.appendChild(newRow);
    newRow.setAttribute("id", workerName.value.trim().split(" "));

    // Creating New Rows and Cells for the Weekly Table
    newRow = document.createElement("tr");
    for (let i = 0; i < 15; i++) {
      const newCell = document.createElement("td");
      newRow.appendChild(newCell);
    }

    // Adding Textcontents to the Each Cell
    newRow.cells[0].textContent = Number(weeklyTbody.lastElementChild.cells[0].textContent) + 1;
    newRow.cells[1].textContent = workerName.value.trim();
    newRow.cells[2].textContent = "✖";
    newRow.cells[3].textContent = "✖";
    newRow.cells[4].textContent = "✖";
    newRow.cells[5].textContent = "✖";
    newRow.cells[6].textContent = "✖";
    newRow.cells[7].textContent = "✖";
    newRow.cells[8].textContent = "✖";
    newRow.cells[9].textContent = 0;
    newRow.cells[10].textContent = 0;
    newRow.cells[11].textContent = 0;
    newRow.cells[12].textContent = 0;
    newRow.cells[13].textContent = 0;
    newRow.cells[14].textContent = 0;
    newRow.cells[15].textContent = 0;

    // Appending the row on the worker details table
    weeklyTbody.appendChild(newRow);
    newRow.setAttribute("id", workerName.value.trim().split(" "));



  } else alert("Bad Request!");
}




// Function to Add Dates on the Table
function updateDates() {
  const today = new Date();

  if (!weeklyTable || !weeklyTable.rows[0]) return;
  // Updating the Current Year
  weeklyTable.rows[0].cells[14].textContent = today.getFullYear();

  // Updating the Current Month
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  weeklyTable.rows[0].cells[13].textContent = monthNames[today.getMonth()];

  // Updating Dates and Day of the Current Week
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay());  // assuming Sunday as the first day of the week

  // For Loop For Iteration Through The Week 
  const date = new Date(firstDayOfWeek);
  for (let i = 0; i < 7; i++) {
    const weeklyDateCell = weeklyTable.rows[0].cells[2 + i];
    date.setDate(firstDayOfWeek.getDate() + i);

    // Formatted as MM-DD and Updating Cells
    weeklyDateCell.textContent = date.toISOString().split("T")[0].slice((date.toISOString().split("T")[0]).indexOf("-") + 1);
  }

  // Checking up the Day input[type="radio"] by default
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  document.querySelector(`input[id="${daysOfWeek[today.getDay()]}"]`).checked = true;
}

// Disabling #totalBill & #totalWork Input Based on Select Element
selectElement.addEventListener("change", function () {
  const selectedValue = this.value;
  let totalBill = document.querySelector("#total-bill");
  let totalBillLabel = document.querySelector(`label[for="total-bill"]`);
  let totalWork = document.querySelector("#total-work");
  let totalWorkLabel = document.querySelector(`label[for="total-work"]`);

  if (selectedValue === "newData") {
    totalBill.disabled = true;
    totalBill.checked = false;
    totalBill.style.setProperty("opacity", "0.7");
    totalBillLabel.style.setProperty("opacity", "0.7");
    totalWork.disabled = true;
    totalWork.checked = false;
    totalWork.style.setProperty("opacity", "0.7");
    totalWorkLabel.style.setProperty("opacity", "0.7");
  } else {
    totalBill.disabled = false;
    totalBill.style.setProperty("opacity", "1");
    totalBillLabel.style.setProperty("opacity", "1");
    totalWork.disabled = false;
    totalWork.style.setProperty("opacity", "1");
    totalWorkLabel.style.setProperty("opacity", "1");
  }
});

// Function to Update Worker's Data with ensuring Validation of the Inputs
function updateWorkerData() {
  const inputInfo = document.querySelector(`input[name="Info"]:checked`);
  const dataInput = document.querySelector(`#data`);

  // Validating User Input
  if (!inputInfo || dataInput.value.trim() === "") {
    alert("Please provide the necessary information...");
    return;
  }

  // Collecting Data From the User Each Provided Input
  const selectedWorker = document.querySelector(`#Worker`).value;
  const selectedDay = document.querySelector(`input[name="Day"]:checked`).value;
  const operation = selectElement.value;
  const dataToOperate = inputInfo.value;
  const dataToInput = dataInput.value.trim();

  // Finding Row Dedicated for the Selected Worker
  const selectedRow = weeklyTbody.querySelector(`tr[id="${selectedWorker}"]`);

  // Operating If "newData"
  if (operation === "newData") {
    // Checking if Operation Value is #produced-on-day and Updating Table Accordingly
    if (dataToOperate === "produced-on-day") {
      const productionIndex = weeklyTable.querySelector(`th[id="${selectedDay}"]`).cellIndex;
      selectedRow.cells[productionIndex].textContent =
        isNaN(Number(selectedRow.cells[productionIndex].textContent)) ?
          dataToInput :
          (Number(selectedRow.cells[productionIndex].textContent) + Number(dataToInput)).toString();
    }
    // Similar logic for other operations
    else if (dataToOperate === "meal-expense") {
      selectedRow.cells[12].textContent =
        selectedRow.cells[12].textContent === "" ?
          dataToInput :
          (Number(selectedRow.cells[12].textContent) + Number(dataToInput)).toString();
    }
    else if (dataToOperate === "worker-deposite") {
      selectedRow.cells[13].textContent =
        selectedRow.cells[13].textContent === "" ?
          dataToInput :
          (Number(selectedRow.cells[13].textContent) + Number(dataToInput)).toString();
    }
    else if (dataToOperate === "owner-advance") {
      selectedRow.cells[14].textContent =
        selectedRow.cells[14].textContent === "" ?
          dataToInput :
          (Number(selectedRow.cells[14].textContent) + Number(dataToInput)).toString();
    }
  }

  // Operating If "editData"
  if (operation === "editData") {
    if (dataToOperate === "produced-on-day") {
      const productionIndex = weeklyTable.querySelector(`th[id="${selectedDay}"]`).cellIndex;
      selectedRow.cells[productionIndex].textContent = dataToInput;
    }
    else if (dataToOperate === "meal-expense") {
      selectedRow.cells[12].textContent = dataToInput;
    }
    else if (dataToOperate === "worker-deposite") {
      selectedRow.cells[13].textContent = dataToInput;
    }
    else if (dataToOperate === "owner-advance") {
      selectedRow.cells[14].textContent = dataToInput;
    }
    else if (dataToOperate === "total-work") {
      selectedRow.cells[9].textContent = dataToInput;
    }
    else if (dataToOperate === "total-bill") {
      selectedRow.cells[11].textContent = dataToInput;
    }
  }

  // Updating Work Rate (Always possible)
  if (dataToOperate === "work-rate") {
    selectedRow.cells[10].textContent = dataToInput;
  }
}


// Function to update automated values on the weekly table (if valid)
//
function calTotalWorkBill(row) {
  // Validate row input
  if (row < 0 || row >= weeklyTbody.rows.length) {
    console.error("Invalid row index");
    return;
  }

  let weeklyWork = [];
  // Collect daily work values (from Sunday to Saturday)
  for (let i = 0; i < 7; i++) {
    const cellContent = weeklyTbody.rows[row].cells[2 + i].textContent.trim();
    // Only add non-empty cell values
    if (cellContent !== "" && !isNaN(cellContent)) {
      weeklyWork.push(Number(cellContent));
    }
  }

  // Calculate total work
  let totalWork = weeklyWork.length > 0
    ? weeklyWork.reduce((sum, value) => sum + value, 0)
    : 0;
  // Update total work cell
  weeklyTbody.rows[row].cells[9].textContent = totalWork.toString();

  // Calculate and update total bill if work rate is available
  const workRateCell = weeklyTbody.rows[row].cells[10];
  if (totalWork > 0 && workRateCell.textContent.trim() !== "") {
    const workRate = Number(workRateCell.textContent);
    const totalBill = totalWork * workRate;
    weeklyTbody.rows[row].cells[11].textContent = (totalBill.toFixed(0)).toString();
  } else {
    // Clear total bill if no work or work rate
    weeklyTbody.rows[row].cells[11].textContent = "";
  }
}

// Autometic Calculation for all workers
function updateAllWorkerTotals() {
  for (let i = 0; i < weeklyTbody.rows.length; i++) {
    calTotalWorkBill(i);
  }
}


// Adding Event Listeners
window.addEventListener("DOMContentLoaded", updateDates);

doneButt.addEventListener("click", () => {
  updateWorkerData();
  updateAllWorkerTotals();
});

