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
        this.requestLift(floor, button);
      });
    });
  }

  requestLift(floor, button) {
    const lift = this.getNearestLift(floor);
    lift.addRequest(floor, button);
  }

  getNearestLift(floor) {
    let nearestLift = null;
    let minDistance = Infinity;
    this.lifts.forEach((lift) => {
      const distance = lift.getDistance(floor);
      if (distance < minDistance) {
        nearestLift = lift;
        minDistance = distance;
      }
    });

    if (!nearestLift) {
      this.lifts.forEach((lift) => {
        const distance = lift.getDistance(floor, false);
        if (distance < minDistance) {
          nearestLift = lift;
          minDistance = distance;
        }
      });
    }

    return nearestLift;
  }
}

class Lift {
  floorHeight = 131.6;
  currentFloor = 0;
  targetFloor = 0;
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
    this.updateScreenStatus();
    this.processQueue();
  }

  processQueue() {
    if (this.isMoving || this.queue.length === 0) return;

    const request = this.queue[0];
    this.moveToFloor(request.floor, request.button);
  }

  async moveToFloor(targetFloor, button) {
    this.isMoving = true;
    this.targetFloor = targetFloor;

    while (this.currentFloor !== this.targetFloor) {
      const nextFloor =
        this.currentFloor < this.targetFloor
          ? this.currentFloor + 1
          : this.currentFloor - 1;
      this.updatePosition(nextFloor);
      this.updateScreenStatus();
      await new Promise((r) => setTimeout(r, 2000));
      this.currentFloor = nextFloor;
    }

    this.updateScreenStatus();

    this.openDoors();

    setTimeout(() => {
      this.closeDoors();

      setTimeout(() => {
        button.style.backgroundColor = "";
        button.disabled = false;
        this.queue.shift();
        this.isMoving = false;
        this.floorScreens[0].innerHTML = "";
        this.floorScreens.shift();
        this.processQueue();
      }, 2500);
    }, 2500);
  }

  updatePosition(nextFloor) {
    this.element.style.transform = `translateY(${
      -nextFloor * this.floorHeight
    }px)`;
  }

  updateScreenStatus() {
    let direction = "";
    for (const request of this.queue) {
      if (request.floor === this.currentFloor) {
        continue;
      }
      direction = request.floor > this.currentFloor ? "▲" : "▼";
      break;
    }
    this.screen.innerHTML = this.targetFloor;
    this.screenUp.innerHTML = direction === "▲" ? "▲" : "";
    this.screenDown.innerHTML = direction === "▼" ? "▼" : "";
    for (const floorScreen of this.floorScreens) {
      floorScreen.innerHTML = this.currentFloor + " " + direction;
    }
  }

  openDoors() {
    this.element.classList.add("open");
  }

  closeDoors() {
    this.element.classList.remove("open");
  }

  getDistance(floor, idle = true) {
    if (idle && this.isMoving) return Infinity;
    if (this.isMoving) {
      const lastFloorInQueue = this.queue[0].floor;
      return Math.abs(lastFloorInQueue - floor);
    }
    return Math.abs(this.currentFloor - floor);
  }
}

// Expose to global scope
window.LiftSystem = LiftSystem;
