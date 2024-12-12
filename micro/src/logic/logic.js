// Register File
class registerFile{
    constructor(name,Qi,content){
        this.name = name;
        this.Qi = Qi;
        this.content = content;
    }
}











// Load Buffer
class loadBuffer{
    constructor(name,busy,address){
        this.name=name;
        this.busy=busy;
        this.address=address;
    }
}











// Store Buffer
class storeBuffer{
    constructor(busy,A,V,Q,Name){
        this.busy=busy;
        this.A=A;
        this.V=V;
        this.Q=Q;
        this.Name=Name;
    }
}











// Addition Reservation Station
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












// Multiplication Reservation Station
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

// Instruction Queue
class instructionQueue{
    constructor(issue,execute,write){
        this.issue=issue;
        this.execute=execute;
        this.write=write;
    }
}











// Cache
class Cache {
    constructor(blockSize, cacheSize, hitLatency = 1, missPenalty = 10) {
        // Size in bytes
        this.blockSize = blockSize;
        this.cacheSize = cacheSize;
        this.numBlocks = Math.floor(cacheSize / blockSize);
        
        // Timing parameters
        this.hitLatency = hitLatency;
        this.missPenalty = missPenalty;
        
        // Cache structure - modified to include more metadata
        this.blocks = Array(this.numBlocks).fill(null).map(() => ({
            valid: false,
            tag: null,
            data: new Array(blockSize).fill(0),
            lastUsed: 0,
            dirty: false,  // Added for write-back policy
            blockAddress: null  // Added to track full block address
        }));
        
        // Statistics
        this.hits = 0;
        this.misses = 0;
        this.accessCount = 0;
    }

    // Modified to handle word-aligned addresses
    getWordAddress(byteAddress) {
        return Math.floor(byteAddress / 4) * 4;
    }

    // Modified to handle block-aligned addresses
    getBlockAddress(byteAddress) {
        return Math.floor(byteAddress / this.blockSize) * this.blockSize;
    }

    // Get block index from address
    getIndex(address) {
        return Math.floor((address / this.blockSize) % this.numBlocks);
    }

    // Get tag from address
    getTag(address) {
        return Math.floor(address / (this.blockSize * this.numBlocks));
    }

    // New method to read a word (4 bytes)
    readWord(address) {
        const wordAddress = this.getWordAddress(address);
        const result = this.access(wordAddress, 4, false);
        return {
            data: result.data,
            cycles: result.cycles,
            hit: result.hit
        };
    }

    // New method to read a double word (8 bytes)
    readDouble(address) {
        const wordAddress = this.getWordAddress(address);
        const result = this.access(wordAddress, 8, false);
        return {
            data: result.data,
            cycles: result.cycles,
            hit: result.hit
        };
    }

    // Modified access method to handle different sizes and write operations
    access(address, size = 4, isWrite = false) {
        this.accessCount++;
        const index = this.getIndex(address);
        const tag = this.getTag(address);
        const block = this.blocks[index];
        const blockOffset = address % this.blockSize;

        // Cache hit
        if (block.valid && block.tag === tag) {
            this.hits++;
            block.lastUsed = this.accessCount;
            
            const data = block.data.slice(blockOffset, blockOffset + size);
            if (isWrite) {
                block.dirty = true;
            }
            
            return {
                hit: true,
                cycles: this.hitLatency,
                data: data
            };
        }

        // Cache miss
        this.misses++;
        
        // Handle dirty block eviction if necessary
        if (block.valid && block.dirty) {
            this.writeBackToMemory(block);
        }
        
        // Load new block from memory
        const blockAddress = this.getBlockAddress(address);
        this.blocks[index] = {
            valid: true,
            tag: tag,
            data: this.loadFromMemory(blockAddress, this.blockSize),
            lastUsed: this.accessCount,
            dirty: isWrite,
            blockAddress: blockAddress
        };

        const data = this.blocks[index].data.slice(blockOffset, blockOffset + size);
        
        return {
            hit: false,
            cycles: this.missPenalty,
            data: data
        };
    }

    // New method to simulate writing back to memory
    writeBackToMemory(block) {
        console.log(`Writing back block at address ${block.blockAddress} to memory`);
        // In a real implementation, this would write to main memory
    }

    // Modified to simulate more realistic memory access
    loadFromMemory(address, size) {
        console.log(`Loading ${size} bytes from memory address ${address}`);
        // Simulate memory access delay
        return new Array(size).fill(0).map((_, i) => {
            // Simulate some pattern based on address for debugging
            return (address + i) % 256;
        });
    }

    // Enhanced statistics
    getStats() {
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: this.hits / (this.hits + this.misses || 1),
            totalAccesses: this.accessCount,
            missRate: this.misses / (this.hits + this.misses || 1)
        };
    }

    // Modified clear method to reset all state
    clear() {
        this.blocks.forEach(block => {
            block.valid = false;
            block.tag = null;
            block.data.fill(0);
            block.lastUsed = 0;
            block.dirty = false;
            block.blockAddress = null;
        });
        this.hits = 0;
        this.misses = 0;
        this.accessCount = 0;
    }
}











// Common Data Bus
class CommonDataBus{
    constructor(tag,value){
        this.tag=tag;
        this.value=value;
    }
}











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












// Branch Handler
class BranchHandler {
    handleBranch(instruction, registers) {
        const [op, rs1, rs2, target] = instruction;
        const val1 = registers.get(rs1);
        const val2 = registers.get(rs2);
        
        switch(op) {
            case 'BEQ':
                return val1 === val2 ? target : null;
            case 'BNE':
                return val1 !== val2 ? target : null;
            default:
                throw new Error(`Unknown branch type: ${op}`);
        }
    }
}














// Tomasulo Controller
export class TomasuloController {
    constructor(config = {}) {
        // Default configuration
        const defaultConfig = {
            addStations: 3,
            multStations: 2,
            loadStations: 3,
            storeStations: 3,
            cacheSize: 4096,
            blockSize: 64
        };

        // Merge default config with provided config
        this.config = { ...defaultConfig, ...config };
        
        this.cycle = 0;
        this.instructionQueue = [];
        
        // Initialize reservation stations with configurable sizes
        this.reservationStations = {
            add: Array(this.config.addStations).fill().map((_, i) => 
                new AdditionReservationStation(`Add${i+1}`, false, null, null, null, null, null, null, 0)
            ),
            mult: Array(this.config.multStations).fill().map((_, i) => 
                new MultiplicationReservationStation(`Mult${i+1}`, false, null, null, null, null, null, null, 0)
            ),
            load: Array(this.config.loadStations).fill().map((_, i) => 
                new LoadReservationStation(false, null)
            ),
            store: Array(this.config.storeStations).fill().map((_, i) => 
                new StoreReservationStation(false, null, null, null)
            )
        };

        // Initialize register file
        this.registerFile = new Map();
        for (let i = 0; i < 32; i++) {
            this.registerFile.set(`R${i}`, new registerFile(`R${i}`, null, 0));
            this.registerFile.set(`F${i}`, new registerFile(`F${i}`, null, 0.0));
        }

        // Initialize cache with configurable parameters
        this.cache = new Cache(this.config.blockSize, this.config.cacheSize);
        this.cdb = null;
        
        // Instruction latencies (configurable)
        this.latencies = {
            'ADD.D': 3,
            'SUB.D': 3,
            'MUL.D': 10,
            'DIV.D': 20,
            'L.D': 2,
            'S.D': 2,
            'DADDI': 1,
            'DSUBI': 1,
            'BEQ': 1,
            'BNE': 1
        };

        // Branch handling
        this.branchHandler = new BranchHandler();
        this.isBranchPending = false;
        this.branchTarget = null;
    }

    // Method to update station sizes
    updateConfiguration(newConfig) {
        // Update configuration
        this.config = { ...this.config, ...newConfig };

        // Reinitialize reservation stations with new sizes
        this.reservationStations = {
            add: Array(this.config.addStations).fill().map((_, i) => 
                new AdditionReservationStation(`Add${i+1}`, false, null, null, null, null, null, null, 0)
            ),
            mult: Array(this.config.multStations).fill().map((_, i) => 
                new MultiplicationReservationStation(`Mult${i+1}`, false, null, null, null, null, null, null, 0)
            ),
            load: Array(this.config.loadStations).fill().map((_, i) => 
                new LoadReservationStation(false, null)
            ),
            store: Array(this.config.storeStations).fill().map((_, i) => 
                new StoreReservationStation(false, null, null, null)
            )
        };

        // Reinitialize cache if cache parameters changed
        if (newConfig.cacheSize || newConfig.blockSize) {
            this.cache = new Cache(this.config.blockSize, this.config.cacheSize);
        }
    }

    // Method to update instruction latencies
    updateLatencies(newLatencies) {
        this.latencies = { ...this.latencies, ...newLatencies };
    }

    // Add instruction to queue
    addInstruction(instruction) {
        this.instructionQueue.push(instruction);
    }

    // Main execution cycle
    executeCycle() {
        console.log(`Executing cycle ${this.cycle}`);
        
        // 1. Write Result (CDB) stage - must be done first
        this.writeResult();
        
        // 2. Execute stage
        this.execute();
        
        // 3. Issue stage
        if (!this.isBranchPending) {
            this.issue();
        }
        
        this.cycle++;
        return this.getSystemState();
    }

    // Issue stage
    issue() {
        if (this.instructionQueue.length === 0) return;
        
        const instruction = this.instructionQueue[0];
        let issued = false;

        switch(this.getInstructionType(instruction)) {
            case 'ADD':
                issued = this.issueToAddRS(instruction);
                break;
            case 'MUL':
                issued = this.issueToMultRS(instruction);
                break;
            case 'LOAD':
                issued = this.issueToLoadBuffer(instruction);
                break;
            case 'STORE':
                issued = this.issueToStoreBuffer(instruction);
                break;
            case 'BRANCH':
                issued = this.issueBranch(instruction);
                break;
        }

        if (issued) {
            this.instructionQueue.shift();
        }
    }

    // Execute stage
    execute() {
        // Execute all active reservation stations
        Object.values(this.reservationStations).flat().forEach(station => {
            if (station.busy && station.isReady()) {
                station.execute();
            }
        });
    }

    // Write Result stage
    writeResult() {
        // Find all completed operations
        const completedStations = Object.values(this.reservationStations)
            .flat()
            .filter(station => station.isCompleted());

        if (completedStations.length > 0) {
            // Prioritize based on instruction type and age
            const station = this.selectStationToWrite(completedStations);
            
            // Broadcast result on CDB
            const result = station.broadcast();
            this.cdb = new CommonDataBus(station.tag, result);
            
            // Update dependent stations and registers
            this.updateDependencies(station.tag, result);
            
            // Clear the station
            station.clear();
        }
    }

    // Helper methods
    getInstructionType(instruction) {
        const op = instruction.split(' ')[0];
        if (['ADD.D', 'SUB.D', 'DADDI', 'DSUBI'].includes(op)) return 'ADD';
        if (['MUL.D', 'DIV.D'].includes(op)) return 'MUL';
        if (['L.D', 'LW'].includes(op)) return 'LOAD';
        if (['S.D', 'SW'].includes(op)) return 'STORE';
        if (['BEQ', 'BNE'].includes(op)) return 'BRANCH';
        throw new Error(`Unknown instruction type: ${op}`);
    }

    issueToAddRS(instruction) {
        const freeStation = this.reservationStations.add.find(station => !station.busy);
        if (!freeStation) return false;

        const [op, dest, src1, src2] = instruction.split(' ');
        freeStation.busy = true;
        freeStation.operation = op;
        freeStation.time = this.latencies[op];

        // Handle dependencies
        const src1Reg = this.registerFile.get(src1);
        const src2Reg = this.registerFile.get(src2);
        
        freeStation.Qi = src1Reg.Qi;
        freeStation.Qj = src2Reg.Qi;
        freeStation.Vi = src1Reg.Qi ? null : src1Reg.content;
        freeStation.Vj = src2Reg.Qi ? null : src2Reg.content;

        // Update destination register
        this.registerFile.get(dest).Qi = freeStation.tag;

        return true;
    }

    issueToMultRS(instruction) {
        const freeStation = this.reservationStations.mult.find(station => !station.busy);
        if (!freeStation) return false;

        const [op, dest, src1, src2] = instruction.split(' ');
        freeStation.busy = true;
        freeStation.operation = op;
        freeStation.time = this.latencies[op];

        // Handle dependencies
        const src1Reg = this.registerFile.get(src1);
        const src2Reg = this.registerFile.get(src2);
        
        freeStation.Qi = src1Reg.Qi;
        freeStation.Qj = src2Reg.Qi;
        freeStation.Vi = src1Reg.Qi ? null : src1Reg.content;
        freeStation.Vj = src2Reg.Qi ? null : src2Reg.content;

        // Update destination register
        this.registerFile.get(dest).Qi = freeStation.tag;

        return true;
    }

    issueToLoadBuffer(instruction) {
        const freeStation = this.reservationStations.load.find(station => !station.busy);
        if (!freeStation) return false;

        const [op, dest, address] = instruction.split(' ');
        freeStation.busy = true;
        freeStation.address = parseInt(address);
        freeStation.time = this.latencies[op];

        // Update destination register
        this.registerFile.get(dest).Qi = freeStation.tag;

        return true;
    }

    issueToStoreBuffer(instruction) {
        const freeStation = this.reservationStations.store.find(station => !station.busy);
        if (!freeStation) return false;

        const [op, src, address] = instruction.split(' ');
        const srcReg = this.registerFile.get(src);

        freeStation.busy = true;
        freeStation.address = parseInt(address);
        freeStation.V = srcReg.Qi ? null : srcReg.content;
        freeStation.Qi = srcReg.Qi;
        freeStation.time = this.latencies[op];

        return true;
    }

    selectStationToWrite(completedStations) {
        // Prioritize based on instruction type and age
        return completedStations.reduce((selected, current) => {
            if (!selected) return current;
            // Add your prioritization logic here
            return selected;
        });
    }

    updateDependencies(tag, value) {
        // Update all reservation stations
        Object.values(this.reservationStations).flat().forEach(station => {
            if (station.busy) {
                station.updateQ(tag, value);
            }
        });

        // Update register file
        for (let [_, register] of this.registerFile) {
            if (register.Qi === tag) {
                register.Qi = null;
                register.content = value;
            }
        }
    }

    getSystemState() {
        return {
            cycle: this.cycle,
            reservationStations: this.reservationStations,
            registerFile: this.registerFile,
            instructionQueue: this.instructionQueue,
            cdb: this.cdb,
            cache: this.cache.getStats()
        };
    }

    reset() {
        this.cycle = 0;
        this.instructionQueue = [];
        Object.values(this.reservationStations).flat().forEach(station => station.clear());
        this.cache.clear();
        this.cdb = null;
        this.isBranchPending = false;
        this.branchTarget = null;
    }
}

// Initial creation with custom configuration
const controller = new TomasuloController({
    addStations: 4,
    multStations: 3,
    loadStations: 2,
    storeStations: 2,
    cacheSize: 8192,
    blockSize: 128
});

// Later update configuration
controller.updateConfiguration({
    addStations: 5,
    multStations: 4
});

// Update instruction latencies
controller.updateLatencies({
    'ADD.D': 4,
    'MUL.D': 12
});

// Export all classes
export {
    registerFile,
    LoadReservationStation,
    StoreReservationStation,
    AdditionReservationStation,
    MultiplicationReservationStation,
    Cache,
    BranchHandler,
    CommonDataBus
};

// Default export for TomasuloController
export default TomasuloController;