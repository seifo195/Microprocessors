class StoreReservationStation {
    constructor(tag, busy, address, Qi, Vi, time) {
        this.tag = tag; 
        this.busy = busy; 
        this.address = address; 
        this.Qi = Qi; 
        this.Vi = Vi; // Value to be stored
        this.time = time; 
        this.operationPerformed = false; 
    }

    execute(memory) {
        if (!this.busy || this.time <= 0) return;

        if (this.Qi !== null) {
            console.log(`Store Station ${this.tag} waiting on dependency Qi: ${this.Qi}`);
            return;
        }

        if (this.time > 0) {
            this.time -= 1;
        }

        // Store the value only after all cycles are completed
        if (this.time === 0 && !this.operationPerformed) {
            memory[this.address] = this.Vi;
            console.log(`Store Station ${this.tag} stored value ${this.Vi} at address ${this.address}`);
            this.operationPerformed = true; // Mark operation as performed
        }
    }

    isCompleted() {
        return this.time <= 0 && this.operationPerformed;
    }

    clear() {
        if (this.isCompleted()) {
            this.busy = false;
            this.address = null;
            this.Qi = null;
            this.Vi = null;
            this.time = 0;
            this.operationPerformed = false; 
        }
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
