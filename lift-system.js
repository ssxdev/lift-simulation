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
  direction = "";
  queue = [];
  floorScreens = [];
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
    this.floorScreens.push(
      button.parentElement.getElementsByClassName(
        "floor-lift-control-screen"
      )[0]
    );
    this.processQueue();
  }

  processQueue() {
    if (this.isMoving || this.queue.length === 0) return;

    const request = this.queue.shift();
    this.moveToFloor(request.floor, request.button);
  }

  async moveToFloor(targetFloor, button) {
    this.isMoving = true;
    this.screen.innerHTML = targetFloor;
    this.direction = targetFloor > this.currentFloor ? "▲" : "▼";
    this.screenUp.innerHTML = this.direction === "▲" ? "▲" : "";
    this.screenDown.innerHTML = this.direction === "▼" ? "▼" : "";

    this.updateFloorScreenStatus();

    while (this.currentFloor !== targetFloor) {
      if (this.direction === "▲") {
        this.currentFloor++;
      } else {
        this.currentFloor--;
      }
      this.updatePosition();
      this.updateFloorScreenStatus();
      await new Promise((r) => setTimeout(r, 2000));
    }

    this.screenUp.innerHTML = "";
    this.screenDown.innerHTML = "";
    this.floorScreens[0].innerHTML = this.currentFloor;
    this.openDoors();

    setTimeout(() => {
      this.closeDoors();

      setTimeout(() => {
        button.style.backgroundColor = "";
        button.disabled = false;
        this.isMoving = false;
        this.direction = "";
        this.updateFloorScreenStatus();
        this.floorScreens.shift();
        this.processQueue();
      }, 2500);
    }, 2500);
  }

  updatePosition() {
    this.element.style.transform = `translateY(${
      -this.currentFloor * this.floorHeight
    }px)`;
  }

  updateFloorScreenStatus() {
    for (const floorScreen of this.floorScreens) {
      if (this.direction)
        floorScreen.innerHTML = `${this.direction} ${this.currentFloor}`;
      else floorScreen.innerHTML = "";
    }
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
