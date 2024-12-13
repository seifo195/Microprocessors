// Store Reservation Station
class StoreReservationStation {
    constructor(busy, address, V, Qi) {
        this.busy = busy;       // Indicates if the station is busy
        this.address = address; // Address to store the value
        this.V = V;             // Value to store
        this.Qi = Qi;           // Dependency on a register (if any)
        this.A = null;          // Placeholder for effective address
        this.time = 0;          // Simulated time for operation to complete
    }

    execute(loadBuffer, storeBuffer) {
        if (!this.busy || this.time <= 0) return;

        // Effective address calculation done in program order
        if (this.A === null) {
            // Placeholder for the effective address calculation (simulate the calculation)
            this.A = this.address;
            console.log(`Store at address ${this.address}, effective address: ${this.A}`);
        }

        // Check for conflicts with active loads and stores in the buffers
        for (let load of loadBuffer) {
            if (load.A === this.A) {
                console.log(`Store at address ${this.address} conflicts with Load at address ${load.A}. Not issued.`);
                return;  // Don't issue the store if there's a conflict
            }
        }
        for (let store of storeBuffer) {
            if (store.A === this.A) {
                console.log(`Store at address ${this.address} conflicts with another Store at address ${store.A}. Not issued.`);
                return;  // Don't issue the store if there's a conflict
            }
        }

        // Simulate execution of store (just a simple print statement for now)
        if (this.time > 0) {
            console.log(`Executing store operation at address ${this.address} with value ${this.V}`);
            this.storeDataInMemory(this.address, this.V);
            this.time -= 1;  // Simulate time decrement
        }
    }

    isCompleted() {
        return this.time <= 0;
    }

    clear() {
        if (this.isCompleted()) {
            this.busy = false;
            this.address = null;
            this.V = null;
            this.Qi = null;
            this.A = null;
            this.time = 0;
        }
    }

    storeDataInMemory(address, value) {
        // Simulate storing data in memory
        console.log(`Storing value ${value} at address ${address}`);
    }

    isReady() {
        return this.A !== null && this.Qi === null; // Ready if address is calculated and no dependencies
    }

    isBusy() {
        return this.busy;
    }
}