class LiftSystem {
  constructor(totalFloors, totalLifts) {
    this.totalFloors = totalFloors;
    this.totalLifts = totalLifts;

    this.lifts = [];
    for (let i = 1; i <= totalLifts; i++) {
      this.lifts.push(new Lift(i));
    }
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll(".floor-lift-control-button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const floor = parseInt(button.dataset.floor);
        const direction = button.dataset.direction;
        this.requestLift(floor, direction, button);
      });
    });
  }

  requestLift(floor, direction, button) {
    const lift = this.getAvailableLift(floor, direction);
    lift.moveToFloor(floor, button);
  }

  getAvailableLift(floor, direction) {
    const availableLift =
      this.lifts.find((lift) => !lift.isMoving) || this.lifts[0];
    return availableLift;
  }
}

class Lift {
  constructor(id) {
    this.id = id;
    this.currentFloor = 0;
    this.element = document.getElementById(`lift-${id}`);
    this.isMoving = false;
  }

  moveToFloor(floor, button) {
    if (this.isMoving) return;

    button.style.backgroundColor = "green";
    button.disabled = true;

    this.isMoving = true;
    const floorHeight = 132;
    const floorsToMove = Math.abs(this.currentFloor - floor);
    const transitionDuration = floorsToMove * 2; // 2 seconds per floor
    const targetPosition = -floor * floorHeight;
    this.element.style.transition = `transform ${transitionDuration}s linear`;
    this.element.style.transform = `translateY(${targetPosition}px)`;
    setTimeout(() => {
      this.currentFloor = floor;
      this.isMoving = false;

      this.openDoors();
      setTimeout(() => {
        this.closeDoors();
        button.style.backgroundColor = "";
        button.disabled = false;
        setTimeout(() => {}, 2500);
      }, 2500);
    }, transitionDuration * 1000);
  }

  openDoors() {
    this.element.classList.add("open");
  }

  closeDoors() {
    this.element.classList.remove("open");
  }
}

// Expose to global scope
window.LiftSystem = LiftSystem;
