class LoadReservationStation {
    constructor(tag, busy, op, address, Qi, time, cache) {
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

        // Wait for dependencies to be resolved
        if (this.Qi !== null) {
            console.log(`Load Station ${this.tag} waiting on dependency Qi: ${this.Qi}`);
            return;
        }

        if (!this.operationPerformed) {
            this.validateOperation();
            // Fetch data from the cache using cacheGet
            const { data, isHit, penalty } = this.cache.cacheGet({ type: this.op }, this.address);

            // Update time with cache penalty if applicable
            this.time += penalty;

            if (data !== undefined) {
                this.result = data;
                console.log(`Load Station ${this.tag} fetched data: ${data} (Cache hit: ${isHit})`);
            } else {
                console.error(`Load Station ${this.tag} failed to fetch data at address ${this.address}.`);
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
