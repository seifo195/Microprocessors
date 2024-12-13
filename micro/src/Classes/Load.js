// Load Reservation Station
class LoadReservationStation {
    constructor(busy, address) {
        this.busy = busy;       // Indicates if the station is busy
        this.address = address; // Address from which data is loaded
        this.A = null;          // Placeholder for effective address
        this.time = 0;          // Simulated time for operation to complete
        this.result = null;     // Result of load operation (data)
    }

    execute(storeBuffer) {
        if (!this.busy || this.time <= 0) return;

        // Effective address calculation done in program order
        if (this.A === null) {
            // Placeholder for the effective address calculation (simulate the calculation)
            this.A = this.address;
            console.log(`Load at address ${this.address}, effective address: ${this.A}`);
        }

        // Check for conflicts with active stores in the store buffer
        for (let store of storeBuffer) {
            if (store.A === this.A) {
                console.log(`Load at address ${this.address} conflicts with Store at address ${store.A}. Not issued.`);
                return;  // Don't issue the load if there's a conflict
            }
        }

        // Simulate execution of load (just a simple assignment for now)
        if (this.time > 0) {
            console.log(`Executing load operation at address ${this.address}`);
            this.result = `Data from address ${this.A}`;
            this.time -= 1;  // Simulate time decrement
        }
    }

    isCompleted() {
        return this.time <= 0 && this.result !== null;
    }

    clear() {
        if (this.isCompleted()) {
            this.busy = false;
            this.address = null;
            this.A = null;
            this.time = 0;
            this.result = null;
        }
    }

    isReady() {
        return this.A !== null; // Ready if effective address has been calculated
    }

    isBusy() {
        return this.busy;
    }
}