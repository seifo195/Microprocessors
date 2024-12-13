const Memory = require('./Memory');
const Cache = require('./Cache');
const RegisterFile = require('./RegisterFile');
const CommonDataBus = require('./CommonDataBus');
const BranchHandler = require('./BranchHandeler');
const AdditionReservationStation = require('./Add');
const MultiplicationReservationStation = require('./Multiply');
const LoadReservationStation = require('./Load');
const StoreReservationStation = require('./Store');

class Processor {
    constructor(config) {
        this.config = {
            addStations: 3,
            mulStations: 2,
            loadBuffers: 3,
            storeBuffers: 3,
            intRegisters: 32,
            fpRegisters: 32,
            cacheSize: 1024,
            blockSize: 64,
            ...config
        };

        // Initialize cache first
        this.cache = new Cache(this.config.cacheSize, this.config.blockSize);

        // Initialize components
        this.registerFile = this.initializeRegisters();
        this.registerStatus = {};
        this.instructionQueue = [];
        this.commonDataBus = new CommonDataBus();
        this.busyPublishers = [];

        // Initialize stations after cache is created
        this.addStations = this.initializeStations('ADD', this.config.addStations);
        this.mulStations = this.initializeStations('MUL', this.config.mulStations);
        this.loadBuffers = this.initializeBuffers('LOAD', this.config.loadBuffers);
        this.storeBuffers = this.initializeBuffers('STORE', this.config.storeBuffers);
        
        this.clock = 0;
    }

    initializeStations(type, count) {
        return Array(count).fill(null).map((_, index) => {
            if (type === 'ADD') {
                return new AdditionReservationStation(
                    `${type}${index}`,
                    false,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    0
                );
            } else if (type === 'MUL') {
                return new MultiplicationReservationStation(
                    `${type}${index}`,
                    false,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    0
                );
            }
        });
    }

    initializeBuffers(type, count) {
        if (type === 'LOAD') {
            return Array(count).fill(null).map((_, index) => {
                return new LoadReservationStation(
                    `${type}${index}`, // tag
                    false,             // busy
                    null,              // op
                    null,              // address
                    null,              // Qi
                    2,                 // time
                    this.cache         // cache
                );
            });
        } else if (type === 'STORE') {
            return Array(count).fill(null).map((_, index) => 
                new StoreReservationStation(
                    `${type}${index}`, // tag
                    false,             // busy
                    null,              // op
                    null,              // address
                    null,              // value
                    null,              // Q
                    0                  // time
                )
            );
        }
        throw new Error(`Invalid buffer type: ${type}`);
    }

    initializeRegisters() {
        return {
            integer: Array(this.config.intRegisters).fill(0),
            floating: Array(this.config.fpRegisters).fill(0),
            status: {}  // Track which reservation station/buffer is going to write to each register
        };
    }

    cycle() {
        this.clock++;
        console.log(`\n=== Clock Cycle ${this.clock} ===`);

        // 1. Issue stage
        const issuedInst = this.issueInstruction();
        if (issuedInst) {
            console.log(`Issued: ${issuedInst.type} ${issuedInst.dest || ''} ${issuedInst.src1 || ''} ${issuedInst.src2 || ''}`);
        } else {
            console.log("No instruction issued");
        }

        // 2. Execute stage
        const executingInsts = this.executeStations();
        if (executingInsts.length > 0) {
            console.log("Executing:");
            executingInsts.forEach(station => {
                console.log(`- ${station.operation} in ${station.tag}, Time remaining: ${station.time}`);
            });
        } else {
            console.log("No instructions executing");
        }

        // 3. Write Result stage
        const writtenInst = this.handleWriteBack();
        if (writtenInst) {
            console.log(`Writing Result: ${writtenInst.tag} → ${writtenInst.value}`);
        } else {
            console.log("No write back");
        }
    }

    issueInstruction() {
        if (this.instructionQueue.length === 0) return null;

        const instruction = this.instructionQueue[0];
        
        // Check for WAW hazards only
        if (instruction.dest && this.registerStatus[instruction.dest]) {
            console.log(`WAW hazard detected: ${instruction.dest} is already waiting for ${this.registerStatus[instruction.dest]}`);
            return null;
        }

        let targetStation = null;

        switch(instruction.type) {
            case 'ADD.D':
            case 'SUB.D':
            case 'ADDI':
            case 'SUBI':
                targetStation = this.issueToAddStation(instruction);
                break;
            case 'MUL.D':
            case 'DIV.D':
                targetStation = this.issueToMulStation(instruction);
                break;
            case 'L.D':
            case 'LW':
                targetStation = this.issueToLoadBuffer(instruction);
                break;
            case 'S.D':
            case 'SW':
                targetStation = this.issueToStoreBuffer(instruction);
                break;
        }

        if (targetStation) {
            this.instructionQueue.shift();
            return instruction;
        }
        return null;
    }

    executeStations() {
        const executingStations = [];

        // Execute load buffers
        this.loadBuffers.forEach(buffer => {
            if (buffer.busy && buffer.time > 0) {
                buffer.time--;
                executingStations.push({
                    operation: buffer.operation,
                    tag: buffer.tag,
                    time: buffer.time
                });
                
                if (buffer.time === 0) {
                    // Load is complete, get value from cache
                    buffer.result = this.cache.getMemoryValue(buffer.address);
                    this.busyPublishers.push(buffer);
                    console.log(`Load completed: Read ${buffer.result} from address ${buffer.address}`);
                }
            }
        });

        // Execute store buffers first if they're ready
        this.storeBuffers.forEach(buffer => {
            if (buffer.busy && buffer.Q === null && buffer.time > 0) {
                // Store is ready to execute (its value is available)
                buffer.time--;
                executingStations.push({
                    operation: buffer.operation,
                    tag: buffer.tag,
                    time: buffer.time
                });
                
                if (buffer.time === 0) {
                    this.cache.Insertintomemory(buffer.address, buffer.value);
                    this.busyPublishers.push(buffer);
                    console.log(`Store completed: Writing ${buffer.value} to address ${buffer.address}`);
                }
            } else if (buffer.busy && buffer.Q !== null) {
                console.log(`Store ${buffer.tag} waiting for ${buffer.Q}`);
            }
        });

        // Only execute computational instructions if there are no executing stores
        const hasExecutingStore = this.storeBuffers.some(buffer => 
            buffer.busy && buffer.Q === null && buffer.time > 0
        );

        if (!hasExecutingStore) {
            // Execute Add and Mul stations
            [...this.addStations, ...this.mulStations].forEach(station => {
                if (station.busy) {
                    if (station.isReady()) {
                        station.execute();
                        executingStations.push({
                            operation: station.operation,
                            tag: station.tag,
                            time: station.time
                        });
                        if (station.isCompleted()) {
                            this.busyPublishers.push(station);
                        }
                    } else {
                        console.log(`${station.tag} waiting for: Qi=${station.Qi}, Qj=${station.Qj}`);
                    }
                }
            });
        } else {
            console.log("Computational instructions waiting for store to complete");
        }

        return executingStations;
    }

    handleWriteBack() {
        if (this.busyPublishers.length === 0) return null;

        const publisher = this.busyPublishers.shift();
        let result;

        if (publisher.tag.startsWith('STORE')) {
            result = publisher.value;
            console.log(`Store completed: ${publisher.tag}`);
            publisher.busy = false;

            // Update any ADD/MUL stations waiting on this store
            [...this.addStations, ...this.mulStations].forEach(station => {
                if (station.busy) {
                    if (station.Qi === publisher.tag) {
                        station.Qi = null;
                        station.Vi = result;
                        console.log(`Updated station ${station.tag} Qi dependency on ${publisher.tag}`);
                    }
                    if (station.Qj === publisher.tag) {
                        station.Qj = null;
                        station.Vj = result;
                        console.log(`Updated station ${station.tag} Qj dependency on ${publisher.tag}`);
                    }
                }
            });
        } else {
            // For computational units (ADD, MUL, LOAD)
            result = publisher.broadcast();
            
            // Update store buffers
            this.storeBuffers.forEach(buffer => {
                if (buffer.busy && buffer.Q === publisher.tag) {
                    buffer.value = result;
                    buffer.Q = null;
                    console.log(`Updated store buffer with value ${result}`);
                }
            });

            // Update Add and Mul stations
            [...this.addStations, ...this.mulStations].forEach(station => {
                if (station.busy) {
                    station.updateQ(publisher.tag, result);
                }
            });

            // Update register status and value
            Object.entries(this.registerStatus).forEach(([reg, tag]) => {
                if (tag === publisher.tag) {
                    delete this.registerStatus[reg];
                    this.updateRegister(reg, { value: result });
                    console.log(`Updated register ${reg} with value ${result}`);
                }
            });

            publisher.clear();
        }

        // Update the CDB
        this.commonDataBus.tag = publisher.tag;
        this.commonDataBus.value = result;

        return { tag: publisher.tag, value: result };
    }

    issueToLoadBuffer(instruction) {
        const availableBuffer = this.loadBuffers.find(buffer => !buffer.busy);
        if (!availableBuffer) return null;

        // Check for WAW hazards
        if (instruction.dest && this.registerStatus[instruction.dest]) {
            return null;
        }

        // Check for RAW hazards (if loading to a register that's being read by previous instructions)
        if (instruction.dest) {
            const isBeingRead = [...this.addStations, ...this.mulStations].some(station => 
                station.busy && (station.Qi === instruction.dest || station.Qj === instruction.dest)
            );
            if (isBeingRead) {
                console.log(`RAW hazard detected: ${instruction.dest} is being read by another instruction`);
                return null;
            }
        }

        availableBuffer.busy = true;
        availableBuffer.op = instruction.type;
        availableBuffer.address = instruction.address;
        availableBuffer.tag = `LD${this.loadBuffers.indexOf(availableBuffer)}`;
        availableBuffer.time = 3;  // Set load latency to 3 cycles
        
        console.log(`Issued load instruction to ${availableBuffer.tag}`);

        // Update register status
        if (instruction.dest) {
            this.registerStatus[instruction.dest] = availableBuffer.tag;
            console.log(`Register ${instruction.dest} now waiting for ${availableBuffer.tag}`);
        }

        return availableBuffer;
    }

    issueToAddStation(instruction) {
        const availableStation = this.addStations.find(station => !station.busy);
        if (!availableStation) return null;

        availableStation.busy = true;
        availableStation.operation = instruction.type;
        availableStation.time = this.getOperationLatency(instruction.type);

        // Check source operand dependencies
        if (instruction.src1) {
            // First check register status
            const src1Status = this.registerStatus[instruction.src1];
            if (src1Status) {
                availableStation.Qi = src1Status;
                availableStation.Vi = null;
            } else {
                // Check if the register is being stored
                const pendingStore = this.storeBuffers.find(buffer => 
                    buffer.busy && buffer.src === instruction.src1
                );
                if (pendingStore) {
                    availableStation.Qi = pendingStore.tag;
                    availableStation.Vi = null;
                } else {
                    availableStation.Qi = null;
                    availableStation.Vi = this.getRegisterValue(instruction.src1).value;
                }
            }

            // Additional check for stores using this register
            if (!availableStation.Qi) {
                const storeUsingReg = this.storeBuffers.find(buffer => 
                    buffer.busy && buffer.src === instruction.src1
                );
                if (storeUsingReg) {
                    availableStation.Qi = storeUsingReg.tag;
                    availableStation.Vi = null;
                }
            }
        }

        if (instruction.src2) {
            const src2Status = this.registerStatus[instruction.src2];
            if (src2Status) {
                availableStation.Qj = src2Status;
                availableStation.Vj = null;
            } else {
                // Check if the register is being stored
                const pendingStore = this.storeBuffers.find(buffer => 
                    buffer.busy && buffer.src === instruction.src2
                );
                if (pendingStore) {
                    availableStation.Qj = pendingStore.tag;
                    availableStation.Vj = null;
                } else {
                    availableStation.Qj = null;
                    availableStation.Vj = this.getRegisterValue(instruction.src2).value;
                }
            }

            // Additional check for stores using this register
            if (!availableStation.Qj) {
                const storeUsingReg = this.storeBuffers.find(buffer => 
                    buffer.busy && buffer.src === instruction.src2
                );
                if (storeUsingReg) {
                    availableStation.Qj = storeUsingReg.tag;
                    availableStation.Vj = null;
                }
            }
        }

        // Update register status for destination
        if (instruction.dest) {
            this.registerStatus[instruction.dest] = availableStation.tag;
        }

        return availableStation;
    }

    issueToMulStation(instruction) {
        const availableStation = this.mulStations.find(station => !station.busy);
        if (!availableStation) return null;

        availableStation.busy = true;
        availableStation.operation = instruction.type;
        availableStation.time = this.getOperationLatency(instruction.type);

        // Handle source operands
        if (instruction.src1) {
            // Check if src1 is waiting for a result
            const src1Status = this.registerStatus[instruction.src1];
            if (src1Status) {
                availableStation.Qi = src1Status;
                availableStation.Vi = null;
                console.log(`MUL station waiting for ${src1Status} to compute ${instruction.src1}`);
            } else {
                availableStation.Qi = null;
                availableStation.Vi = this.getRegisterValue(instruction.src1).value;
            }
        }

        if (instruction.src2) {
            // Check if src2 is waiting for a result
            const src2Status = this.registerStatus[instruction.src2];
            if (src2Status) {
                availableStation.Qj = src2Status;
                availableStation.Vj = null;
                console.log(`MUL station waiting for ${src2Status} to compute ${instruction.src2}`);
            } else {
                availableStation.Qj = null;
                availableStation.Vj = this.getRegisterValue(instruction.src2).value;
            }
        }

        // Update destination register status
        if (instruction.dest) {
            this.registerStatus[instruction.dest] = availableStation.tag;
        }

        return availableStation;
    }

    issueToStoreBuffer(instruction) {
        const availableBuffer = this.storeBuffers.find(buffer => !buffer.busy);
        if (!availableBuffer) return null;

        availableBuffer.busy = true;
        availableBuffer.operation = instruction.type;
        availableBuffer.address = instruction.address;
        availableBuffer.src = instruction.src;  // Save source register for dependency checking
        availableBuffer.time = this.getOperationLatency(instruction.type);

        // Check if source register is waiting for a result
        const srcStatus = this.registerStatus[instruction.src];
        if (srcStatus) {
            console.log(`Store waiting for ${srcStatus} to compute ${instruction.src}`);
            availableBuffer.Q = srcStatus;
            availableBuffer.value = null;
        } else {
            availableBuffer.Q = null;
            availableBuffer.value = this.getRegisterValue(instruction.src).value;
        }

        return availableBuffer;
    }

    getOperationLatency(operation) {
        const latencies = {
            'L.D': 3,
            'S.D': 2,
            'LW': 2,
            'SW': 2,
            'ADD.D': 3,
            'SUB.D': 3,
            'MUL.D': 10,
            'DIV.D': 20,
            'ADDI': 1,
            'SUBI': 1
        };
        return latencies[operation] || 1;
    }

    getRegisterValue(register) {
        // Determine if it's an integer or floating-point register
        const isFloat = register.charAt(0) === 'F';
        const index = parseInt(register.slice(1));
        
        if (isFloat) {
            return {
                value: this.registerFile.floating[index],
                Q: null  // Add logic to track dependencies
            };
        } else {
            return {
                value: this.registerFile.integer[index],
                Q: null  // Add logic to track dependencies
            };
        }
    }

    updateRegister(register, { value = null, Q = null }) {
        const isFloat = register.charAt(0) === 'F';
        const index = parseInt(register.slice(1));
        
        if (isFloat) {
            if (value !== null) this.registerFile.floating[index] = value;
            // Add logic to track dependencies with Q
        } else {
            if (value !== null) this.registerFile.integer[index] = value;
            // Add logic to track dependencies with Q
        }
    }

    updateStatus() {
        return {
            clock: this.clock,
            addStations: this.addStations.map(station => ({
                tag: station.tag,
                busy: station.busy,
                operation: station.operation,
                Vi: station.Vi,
                Vj: station.Vj,
                Qi: station.Qi,
                Qj: station.Qj,
                time: station.time,
                result: station.result
            })),
            mulStations: this.mulStations.map(station => ({
                tag: station.tag,
                busy: station.busy,
                operation: station.operation,
                Vi: station.Vi,
                Vj: station.Vj,
                Qi: station.Qi,
                Qj: station.Qj,
                time: station.time,
                result: station.result
            })),
            loadBuffers: this.loadBuffers.map(buffer => ({
                tag: buffer.tag,
                busy: buffer.busy,
                address: buffer.address,
                time: buffer.time,
                result: buffer.result
            })),
            storeBuffers: this.storeBuffers.map(buffer => ({
                tag: buffer.tag,
                busy: buffer.busy,
                address: buffer.address,
                value: buffer.value,
                Q: buffer.Q,
                time: buffer.time
            })),
            registerFile: {
                integer: [...this.registerFile.integer],
                floating: [...this.registerFile.floating]
            },
            registerStatus: { ...this.registerStatus },
            cdb: {
                tag: this.commonDataBus.tag,
                value: this.commonDataBus.value
            },
            instructionQueue: [...this.instructionQueue]
        };
    }

    getRegisterStatus() {
        return {
            integer: this.registerFile.integer.map((value, index) => ({
                register: `R${index}`,
                value: value,
                status: this.registerStatus[`R${index}`] || null
            })),
            floating: this.registerFile.floating.map((value, index) => ({
                register: `F${index}`,
                value: value,
                status: this.registerStatus[`F${index}`] || null
            }))
        };
    }

    printStatus() {
        const status = this.updateStatus();
        
        console.log("\nReservation Stations Status:");
        console.log("Add Stations:");
        status.addStations.forEach(station => {
            if (station.busy) {
                console.log(`${station.tag}: Op=${station.operation}, Vi=${station.Vi}, Vj=${station.Vj}, Qi=${station.Qi}, Qj=${station.Qj}, Time=${station.time}`);
            }
        });

        console.log("\nMultiply Stations:");
        status.mulStations.forEach(station => {
            if (station.busy) {
                console.log(`${station.tag}: Op=${station.operation}, Vi=${station.Vi}, Vj=${station.Vj}, Qi=${station.Qi}, Qj=${station.Qj}, Time=${station.time}`);
            }
        });

        console.log("\nLoad Buffers:");
        status.loadBuffers.forEach(buffer => {
            if (buffer.busy) {
                console.log(`${buffer.tag}: Address=${buffer.address}, Time=${buffer.time}`);
            }
        });

        console.log("\nStore Buffers:");
        status.storeBuffers.forEach(buffer => {
            if (buffer.busy) {
                console.log(`${buffer.tag}: Address=${buffer.address}, Value=${buffer.value}, Q=${buffer.Q}, Time=${buffer.time}`);
            }
        });

        console.log("\nRegister Status:");
        const regStatus = this.getRegisterStatus();
        console.log("Integer Registers:");
        regStatus.integer.forEach(reg => {
            if (reg.value !== 0 || reg.status) {
                console.log(`${reg.register}: Value=${reg.value}, Waiting for=${reg.status}`);
            }
        });
        console.log("Floating Point Registers:");
        regStatus.floating.forEach(reg => {
            if (reg.value !== 0 || reg.status) {
                console.log(`${reg.register}: Value=${reg.value}, Waiting for=${reg.status}`);
            }
        });

        console.log("\nCommon Data Bus:");
        if (status.cdb.tag) {
            console.log(`Tag: ${status.cdb.tag}, Value: ${status.cdb.value}`);
        } else {
            console.log("Empty");
        }
    }
}

function main() {
    // Initialize processor with test configuration
    const processor = new Processor({
        addStations: 3,
        mulStations: 2,
        loadBuffers: 3,
        storeBuffers: 3,
        cacheSize: 128,
        blockSize: 16
    });

    // Pre-load memory values
    processor.cache.Insertintomemory(100, 50);
    processor.cache.Insertintomemory(104, 30);

    // Pre-load register values
    processor.registerFile.integer[1] = 100;  // Address for store
    processor.registerFile.floating[2] = 10.0;
    processor.registerFile.floating[4] = 20.0;

    // Create test instructions with dependencies
    const instructions = [
        { type: 'ADD.D', dest: 'F6', src1: 'F2', src2: 'F4' },  // F6 = F2 + F4
        { type: 'L.D', src: 'F6', address: 100 },               // Store F6 to memory[100]
        { type: 'ADD.D', dest: 'F8', src1: 'F6', src2: 'F2' }   // F8 = F6 + F2 (RAW dependency)
    ];

    // Load instructions into processor
    processor.instructionQueue = [...instructions];

    // Run simulation for 10 cycles or until completion
    const maxCycles = 10;
    console.log("Starting Tomasulo Simulation - ADD/STORE Test");
    console.log("============================================");

    for (let i = 0; i < maxCycles; i++) {
        processor.cycle();
        processor.printStatus();  // This will show the detailed state after each cycle

        // Check if simulation is complete
        const status = processor.updateStatus();
        if (processor.instructionQueue.length === 0 && 
            !status.addStations.some(s => s.busy) &&
            !status.mulStations.some(s => s.busy) &&
            !status.loadBuffers.some(b => b.busy) &&
            !status.storeBuffers.some(b => b.busy)) {
            console.log("\nSimulation completed!");
            break;
        }
    }

    // Print final memory state
    console.log("\nFinal Memory State:");
    console.log("Address 100:", processor.cache.getMemoryValue(100));
}

// Export both the class and main function
module.exports = {
    Processor,
    main
};

// Run the simulation
main();