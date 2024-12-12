
// Addition Reservation Station
class AdditionReservationStation {
    constructor(tag, busy, operation, Vi, Vj, Qi, Qj, A, time) {
        this.tag = tag;
        this.busy = busy;
        this.operation = operation;
        this.Vi = Vi;
        this.Vj = Vj;
        this.Qi = Qi;
        this.Qj = Qj;
        this.A = A;
        this.time = time;
        this.result = null;
        this.operationPerformed = false;
    }

    validateOperation() {
        if (!["DADDI", "DSUBI", "ADD.D", "ADD.S", "SUB.D", "SUB.S"].includes(this.operation)) {
            throw new Error(`Invalid operation ${this.operation} in station ${this.tag}`);
        }
    }

    execute() {
        if (!this.busy || this.time <= 0) return;

        // Wait until all dependencies are resolved
        if (this.Qi !== null || this.Qj !== null) {
            console.log(`Station ${this.tag} waiting on dependencies Qi: ${this.Qi}, Qj: ${this.Qj}`);
            return;
        }

        // Perform the operation only once
        if (!this.operationPerformed) {
            this.validateOperation();

            switch (this.operation) {
                case "DADDI":
                case "ADD.D":
                case "ADD.S":
                    this.result = this.Vi + this.Vj;
                    break;
                case "DSUBI":
                case "SUB.D":
                case "SUB.S":
                    this.result = this.Vi - this.Vj;
                    break;
                default:
                    console.error(`Unsupported operation: ${this.operation} in station ${this.tag}`);
            }

            this.operationPerformed = true; 
        }

        if (this.time > 0) {
            this.time -= 1;
        }
    }

    isCompleted() {
        return this.time <= 0 && this.result !== null;
    }

    clear() {
        if (this.isCompleted()) {
            this.busy = false;
            this.operation = null;
            this.Vi = null;
            this.Vj = null;
            this.Qi = null;
            this.Qj = null;
            this.A = null;
            this.time = 0;
            this.result = null;
            this.operationPerformed = false; // Reset the flag for the next operation
        }
    }

    broadcast() {
        return this.result;
    }

    updateQ(tag, value) {
        if (this.Qi === tag) {
            this.Vi = value;
            this.Qi = null;
        }
        if (this.Qj === tag) {
            this.Vj = value;
            this.Qj = null;
        }
    }

    isReady() {
        return this.Qi === null && this.Qj === null;
    }

    isBusy() {
        return this.busy;
    }

    isExecuting() {
        return this.time > 0;
    }

}

function main() {
    console.log("Hello World");
    const add = new AdditionReservationStation(1, true, "ADD.D", 1, 2, null, null, null, 0);
    add.execute();
    console.log(add.broadcast());
}
main();
export default AdditionReservationStation;  
