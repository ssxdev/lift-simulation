// index.html
async function loadHtml(file, elementId) {
  await fetch(file)
    .then((response) => response.text())
    .then((data) => (document.getElementById(elementId).innerHTML = data))
    .catch((error) => console.error(`Error loading ${file}: ${error}`));
}

// instructions.html
document.addEventListener("DOMContentLoaded", async () => {
  await loadHtml("instructions.html", "main-content");

  // Load instructions
  const instructions = [
    "Enter the number of floors and lifts to simulate the lift system.",
    "Click the 'Start Simulation' button to start the simulation.",
    "Click any floor 'up' or 'down' button to call the lift.",
  ];

  const instructionsList = document.getElementById("instructions-list");
  instructions.forEach((instruction) => {
    const li = document.createElement("li");
    li.textContent = instruction;
    instructionsList.appendChild(li);
  });

  // Load lift system form interaction
  const liftSystemForm = document.getElementById("lift-system-form");

  liftSystemForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const totalFloors = parseInt(
      document.getElementById("total-floors-input").value
    );
    const totalLifts = parseInt(
      document.getElementById("total-lifts-input").value
    );

    if (totalFloors < 2 || totalFloors > 10) {
      alert("Number of floors should be between 2 and 10");
      return;
    }
    if (totalLifts < 1 || totalLifts > 10) {
      alert("Number of lifts should be between 1 and 10");
      return;
    }
    if (totalLifts > totalFloors) {
      alert("Why do you need more lifts than floors?");
      return;
    }

    loadLiftSimulation(totalFloors, totalLifts);
  });
});

// lift-simulation.html
async function loadLiftSimulation(totalFloors, totalLifts) {
  await loadHtml("lift-simulation.html", "main-content");

  const liftSimulationPara = document.getElementById("lift-simulation-para");
  liftSimulationPara.textContent = `Lift Simulation with ${totalFloors} floors and ${totalLifts} lifts`;

  // Create building
  generateBuilding(totalFloors, totalLifts);

  // Initialize lift system
  new LiftSystem(totalFloors, totalLifts);
}

function generateBuilding(totalFloors, totalLifts) {
  const building = document.getElementById("building");
  building.innerHTML = "";

  for (let floor = totalFloors; floor >= 0; floor--) {
    const floorDiv = document.createElement("div");
    floorDiv.className = "floor";

    // Floor control system
    const floorControl = `
      <div class="floor-lift-control">
        ${
          floor !== totalFloors
            ? ` <div class="floor-lift-control-up">
                  <div class="floor-lift-control-screen"></div>
                  <button class="floor-lift-control-button" data-floor=${floor} data-direction="up">Up</button>
                </div>`
            : ""
        }
        ${
          floor !== 0
            ? ` <div class="floor-lift-control-down">
                  <div class="floor-lift-control-screen"></div>
                  <button class="floor-lift-control-button" data-floor=${floor} data-direction="down">Down</button>
                </div>`
            : ""
        }
      </div>`;

    floorDiv.innerHTML += floorControl;

    // Floor lifts
    const floorLiftsDiv = document.createElement("div");
    floorLiftsDiv.className = "floor-lifts";

    for (let lift = 1; lift <= totalLifts; lift++) {
      const floorLiftDiv = document.createElement("div");
      floorLiftDiv.className = "floor-lift";
      if (floor === 0) {
        floorLiftDiv.innerHTML = `
        <div class="lift" id="lift-${lift}">
            <div class="lift-door-screen">
                <div class="lift-door-screen-up"></div>
                <div class="lift-door-screen-text"></div>
                <div class="lift-door-screen-down"></div>
            </div>
            <div class="lift-door">
                <div class="lift-door-left"></div>
                <div class="lift-door-right"></div>
            </div>
        </div>`;
      }
      floorLiftsDiv.appendChild(floorLiftDiv);
    }

    floorDiv.appendChild(floorLiftsDiv);

    // Floor number
    const floorNumberDiv = document.createElement("div");
    floorNumberDiv.className = "floor-number";
    if (floor === 0) {
      floorNumberDiv.innerHTML = `<div>Ground Floor</div>`;
    } else if (floor === 1) {
      floorNumberDiv.innerHTML = `<div>${floor}st Floor</div>`;
    } else if (floor === 2) {
      floorNumberDiv.innerHTML = `<div>${floor}nd Floor</div>`;
    } else if (floor === 3) {
      floorNumberDiv.innerHTML = `<div>${floor}rd Floor</div>`;
    } else {
      floorNumberDiv.innerHTML = `<div>${floor}th Floor</div>`;
    }

    floorDiv.appendChild(floorNumberDiv);

    // Append floor to building
    building.appendChild(floorDiv);
  }
}
