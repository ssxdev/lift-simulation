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

    loadLiftSimulation(totalFloors, totalLifts);
  });
});

// lift-simulation.html
async function loadLiftSimulation(totalFloors, totalLifts) {
  await loadHtml("lift-simulation.html", "main-content");

  // Initialize lift system
  const liftSystem = new LiftSystem(totalFloors, totalLifts);

  const liftSimulationPara = document.getElementById("lift-simulation-para");
  liftSimulationPara.textContent = `Lift Simulation with ${totalFloors} floors and ${totalLifts} lifts`;
}
