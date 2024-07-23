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
    lift.addRequest(floor, button);
  }

  getAvailableLift(floor, direction) {
    const availableLift = this.lifts[0];
    return availableLift;
  }
}

class Lift {
  floorHeight = 132;
  currentFloor = 0;
  queue = [];
  isMoving = false;

  constructor(id) {
    this.id = id;
    this.element = document.getElementById(`lift-${id}`);
    this.screen = this.element.getElementsByClassName(
      "lift-door-screen-text"
    )[0];
    this.screen.innerHTML = this.currentFloor;
    this.screenUp = this.element.getElementsByClassName(
      "lift-door-screen-up"
    )[0];
    this.screenDown = this.element.getElementsByClassName(
      "lift-door-screen-down"
    )[0];
  }

  addRequest(floor, button) {
    button.style.backgroundColor = "green";
    button.disabled = true;
    this.queue.push({ floor, button });
    this.processQueue();
  }

  processQueue() {
    if (this.isMoving || this.queue.length === 0) return;

    const request = this.queue.shift();
    this.moveToFloor(request.floor, request.button);
  }

  moveToFloor(floor, button) {
    this.isMoving = true;
    this.screen.innerHTML = floor;
    this.screenUp.innerHTML = this.currentFloor < floor ? "▲" : "";
    this.screenDown.innerHTML = this.currentFloor > floor ? "▼" : "";

    const travelTime = Math.abs(this.currentFloor - floor) * 2;

    this.element.style.transition = `transform ${travelTime}s linear`;
    this.element.style.transform = `translateY(${-floor * this.floorHeight}px)`;

    setTimeout(() => {
      this.currentFloor = floor;
      this.screenUp.innerHTML = "";
      this.screenDown.innerHTML = "";
      this.openDoors();

      setTimeout(() => {
        this.closeDoors();

        setTimeout(() => {
          button.style.backgroundColor = "";
          button.disabled = false;
          this.isMoving = false;
          this.processQueue();
        }, 2500);
      }, 2500);
    }, travelTime * 1000);
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
