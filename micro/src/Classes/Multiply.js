class MultiplicationReservationStation {
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
        if (!["MUL.D", "MUL.S", "DIV.D", "DIV.S"].includes(this.operation)) {
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
                case "MUL.D":
                case "MUL.S":
                    this.result = this.Vi * this.Vj;
                    break;
                case "DIV.D":
                case "DIV.S":
                    if (this.Vj === 0) {
                        console.error(`Division by zero in station ${this.tag}!`);
                        this.result = null; // Handle division by zero
                    } else {
                        this.result = this.Vi / this.Vj;
                    }
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

    isDividing() {
        return this.operation === "DIV.D" || this.operation === "DIV.S";
    }

    isMultiplying() {
        return this.operation === "MUL.D" || this.operation === "MUL.S";
    }

    isExecuting() {
        return this.time > 0;
    }

}
function main() {
    console.log("Hello World");
    const multiply = new MultiplicationReservationStation(1, true, "MUL.D", null, null, "Q1", "Q2", null, 5);

    // Simulate the resolution of dependencies
    setTimeout(() => {
        multiply.updateQ("Q1", 10);
        multiply.updateQ("Q2", 2);
    }, 2000);

    const interval = setInterval(() => {
        console.log(`Clock cycle: ${5 - multiply.time}`);
        console.log(`Station state:`, {
            tag: multiply.tag,
            busy: multiply.busy,
            operation: multiply.operation,
            Vi: multiply.Vi,
            Vj: multiply.Vj,
            Qi: multiply.Qi,
            Qj: multiply.Qj,
            A: multiply.A,
            time: multiply.time,
            result: multiply.result,
            operationPerformed: multiply.operationPerformed
        });

        multiply.execute();
        
        if (!multiply.isExecuting()) {
            clearInterval(interval);
            console.log(multiply.broadcast());
            multiply.clear();
            console.log(`Station state after complete:`, {
                tag: multiply.tag,
                busy: multiply.busy,
                operation: multiply.operation,
                Vi: multiply.Vi,
                Vj: multiply.Vj,
                Qi: multiply.Qi,
                Qj: multiply.Qj,
                A: multiply.A,
                time: multiply.time,
                result: multiply.result,
                operationPerformed: multiply.operationPerformed
            });
        }
    }, 1000);
}

main();
module.exports =  MultiplicationReservationStation;

