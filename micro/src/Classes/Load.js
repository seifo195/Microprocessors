class LoadReservationStation {
    constructor(tag, busy, op, address, Qi=null, time, cache) {
        this.tag = tag; 
        this.busy = busy; 
        this.op = op;
        this.address = address; 
        this.Qi = Qi; 
        this.time = time; 
        this.result = null; 
        this.operationPerformed = false; 
        this.cache = cache; // Reference to cache instance
    }

    validateOperation() {
        if (!["LW", "LD", "L.S", "L.D"].includes(this.op)) {
            throw new Error(`Invalid operation ${this.op} in station ${this.tag}`);
        }
    }

    execute() {
        if (!this.busy || this.time <= 0) return;

        // Decrement time first
        this.time--;

        // Only perform the load operation once when we start
        if (!this.operationPerformed) {
            const { data, isHit, penalty } = this.cache.cacheGet({ type: this.op }, this.address);
            this.result = data;
            this.operationPerformed = true;
            console.log(`Load Station ${this.tag} fetched data: ${data} (Cache hit: ${isHit})`);
        }
    }

    isCompleted() {
        return this.time <= 0 && this.result !== null;
    }

    clear() {
        if (this.isCompleted()) {
            this.busy = false;
            this.op = null;
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

module.exports = LoadReservationStation;