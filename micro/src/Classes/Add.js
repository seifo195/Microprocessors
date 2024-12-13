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
        if (!["DADDI", "DSUBI", "ADDI", "SUBI", "ADD.D", "ADD.S", "SUB.D", "SUB.S"].includes(this.operation)) {
            throw new Error(`Invalid operation ${this.operation} in station ${this.tag}`);
        }
    }

    execute() {
        if (!this.busy || this.time <= 0) return;

        if (!this.operationPerformed) {
            this.validateOperation();

            // Convert values to numbers before operation
            const vi = Number(this.Vi);
            const vj = Number(this.Vj);

            switch (this.operation) {
                case 'ADD.D':
                case 'ADDI':
                case 'DADDI':
                case 'ADD.S':
                    this.result = Number(vi) + Number(vj);
                    break;
                case 'SUB.D':
                case 'SUBI':
                case 'DSUBI':
                case 'SUB.S':
                    this.result = Number(vi) - Number(vj);
                    break;
                default:
                    throw new Error(`Invalid operation ${this.operation} in station ${this.tag}`);
            }

            this.operationPerformed = true;
            console.log(`${this.tag} performed ${this.operation}: ${vi} ${this.operation.includes('ADD') ? '+' : '-'} ${vj} = ${this.result}`);
        }

        if (this.time > 0) {
            this.time--;
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
            this.operationPerformed = false;
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

module.exports = AdditionReservationStation;