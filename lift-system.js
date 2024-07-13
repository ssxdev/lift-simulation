class LiftSystem {
  constructor(totalFloors, totalLifts) {
    this.totalFloors = totalFloors;
    this.totalLifts = totalLifts;
  }
}

// Expose to global scope
window.LiftSystem = LiftSystem;
