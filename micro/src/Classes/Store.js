class StoreReservationStation {
    constructor(tag, busy, op, address, Qi, Vi, time, cache) {
        this.tag = tag;
        this.busy = busy;
        this.op = op;
        this.address = address;
        this.Qi = Qi;
        this.Vi = Vi; // Value to be stored
        this.time = time;
        this.operationPerformed = false;
        this.cache = cache; // Reference to cache instance
    }

    validateOperation() {
        if (!["SW", "SD", "S.S", "S.D"].includes(this.op)) {
            throw new Error(`Invalid operation ${this.op} in station ${this.tag}`);
        }
    }

    execute() {
        if (!this.busy || this.time < 0) return;

        // Wait for dependencies to be resolved
        if (this.Qi !== null) {
            console.log(`Store Station ${this.tag} waiting on dependency Qi: ${this.Qi}`);
            return;
        }

        if (this.time > 0) {
            this.time -= 1;
        }

        // Perform the store operation only after all cycles are completed
        if (this.time === 0 && !this.operationPerformed) {
            this.validateOperation();
            const { isHit, penalty } = this.cache.cacheGet(this.op, this.address, this.Vi);

            if (!isHit) {
                console.log(`Store Station ${this.tag} encountered a cache miss. Applying penalty of ${penalty} cycles.`);
                this.time += penalty; // Apply cache miss penalty
                return;
            }

            console.log(
                `Store Station ${this.tag} successfully stored value ${this.Vi} at address ${this.address} (Cache Hit: ${isHit})`
            );
            this.operationPerformed = true;
        }
    }

    isCompleted() {
        return this.time <= 0 && this.operationPerformed;
    }

    clear() {
        if (this.isCompleted()) {
            this.busy = false;
            this.address = null;
            this.op = null;
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
        return this.time >= 0;
    }
}
