class registerFile{
    constructor(name,data,availability){
        this.name = name;
        this.Qi = Qi;
        this.content = content;
    }
}
class loadBuffer{
    constructor(name,busy,address){
        this.name=name;
        this.busy=busy;
        this.address=address;
    }
}
class storeBuffer{
    constructor(busy,A,V,Q,Name){
        this.busy=busy;
        this.A=A;
        this.V=V;
        this.Q=Q;
        this.Name=Name;
    }
}
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

class instructionQueue{
    constructor(issue,execute,write){
        this.issue=issue;
        this.execute=execute;
        this.write=write;
    }
}
class Cache {
    constructor(blockSize, cacheSize, hitLatency = 1, missPenalty = 10) {
        // Size in bytes
        this.blockSize = blockSize;
        this.cacheSize = cacheSize;
        this.numBlocks = Math.floor(cacheSize / blockSize);
        
        // Timing parameters
        this.hitLatency = hitLatency;
        this.missPenalty = missPenalty;
        
        // Cache structure
        this.blocks = Array(this.numBlocks).fill(null).map(() => ({
            valid: false,
            tag: null,
            data: new Array(blockSize).fill(0),
            lastUsed: 0
        }));
        
        // Statistics
        this.hits = 0;
        this.misses = 0;
    }

    // Get block index from address
    getIndex(address) {
        return (address / this.blockSize) % this.numBlocks;
    }

    // Get tag from address
    getTag(address) {
        return Math.floor(address / (this.blockSize * this.numBlocks));
    }

    // Access memory at given address
    access(address) {
        const index = this.getIndex(address);
        const tag = this.getTag(address);
        const block = this.blocks[index];

        // Cache hit
        if (block.valid && block.tag === tag) {
            this.hits++;
            block.lastUsed = Date.now();
            return {
                hit: true,
                cycles: this.hitLatency,
                data: block.data[address % this.blockSize]
            };
        }

        // Cache miss
        this.misses++;
        
        // Load new block from memory
        this.blocks[index] = {
            valid: true,
            tag: tag,
            data: this.loadFromMemory(address, this.blockSize),
            lastUsed: Date.now()
        };

        return {
            hit: false,
            cycles: this.missPenalty,
            data: this.blocks[index].data[address % this.blockSize]
        };
    }

    // Simulate loading data from main memory
    loadFromMemory(address, size) {
        // In a real implementation, this would fetch from main memory
        // For simulation, we'll just return an array of zeros
        return new Array(size).fill(0);
    }

    // Get cache statistics
    getStats() {
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: this.hits / (this.hits + this.misses || 1),
            totalAccesses: this.hits + this.misses
        };
    }

    // Clear cache
    clear() {
        this.blocks.forEach(block => {
            block.valid = false;
            block.tag = null;
            block.data.fill(0);
        });
        this.hits = 0;
        this.misses = 0;
    }
}

class commonDataBus{
    constructor(tag,content){
        this.tag=tag;
        this.content=content;
    }
}