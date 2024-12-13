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
            )
            // ,
            // load: Array(this.config.loadStations).fill().map((_, i) => 
            //     new LoadReservationStation(false, null)
            // ),
            // store: Array(this.config.storeStations).fill().map((_, i) => 
            //     new StoreReservationStation(false, null, null, null)
            // )
        };

        // Initialize register file
        this.registerFile = new Map();
        for (let i = 0; i < 32; i++) {
            this.registerFile.set(`R${i}`, new RegisterFile(`R${i}`, null, 0));
            this.registerFile.set(`F${i}`, new RegisterFile(`F${i}`, null, 0.0));
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
            )
            // ,
            // load: Array(this.config.loadStations).fill().map((_, i) => 
            //     new LoadReservationStation(false, null)
            // ),
            // store: Array(this.config.storeStations).fill().map((_, i) => 
            //     new StoreReservationStation(false, null, null, null)
            // )
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
}

function main(){
    const processor = new Processor();
    console.log(processor.config);
    processor.updateConfiguration({addStations: 4, multStations: 3, loadStations: 4, storeStations: 4});
    console.log(processor.config);
}

main();

module.exports = Processor;
