import TomasuloController, {
    registerFile,
    LoadReservationStation,
    StoreReservationStation,
    AdditionReservationStation,
    MultiplicationReservationStation,
    Cache,
    BranchHandler,
    CommonDataBus
} from './logic.js';

// Test 1: Basic Controller Creation
console.log("\n=== Test 1: Controller Creation ===");
const controller = new TomasuloController();
console.log("Controller created:", controller.getSystemState());

// Test 2: Register File Operations
console.log("\n=== Test 2: Register File Operations ===");
const reg = new registerFile("R1", null, 10);
console.log("Register created:", reg);

// Test 3: Addition Reservation Station
console.log("\n=== Test 3: Addition Reservation Station ===");
const addRS = new AdditionReservationStation("Add1", true, "ADD.D", 5, 3, null, null, null, 3);
addRS.execute();
console.log("Addition result:", addRS.result);

// Test 4: Cache Operations
console.log("\n=== Test 4: Cache Operations ===");
const cache = new Cache(64, 1024);
const readResult = cache.readWord(100);
console.log("Cache read result:", readResult);

// Test 5: Full Instruction Execution
console.log("\n=== Test 5: Full Instruction Execution ===");
controller.addInstruction("ADD.D F1 F2 F3");
controller.executeCycle();
console.log("System state after execution:", controller.getSystemState()); 