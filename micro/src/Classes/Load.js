class LoadReservationStation {
    constructor(tag, busy, address, Qi, time) {
        this.tag = tag; 
        this.busy = busy; 
        this.address = address; 
        this.Qi = Qi; 
        this.time = time; 
        this.result = null; 
        this.operationPerformed = false; 
    }

    execute(memory) {
        if (!this.busy || this.time <= 0) return;

        // Wait for dependencies to be resolved
        if (this.Qi !== null) {
            console.log(`Load Station ${this.tag} waiting on dependency Qi: ${this.Qi}`);
            return;
        }

        if (!this.operationPerformed) {
            if (this.address in memory) {
                this.result = memory[this.address];
            } else {
                console.error(`Memory address ${this.address} not found.`);
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
            this.address = null;
            this.Qi = null;
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
            this.address += value; 
            this.Qi = null;
        }
    }

    isReady() {
        return this.Qi === null;
    }

    isBusy() {
        return this.busy;
    }

    isExecuting() {
        return this.time > 0;
    }
}
