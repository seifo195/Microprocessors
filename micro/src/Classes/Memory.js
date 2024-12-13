class Memory {
    constructor(size) {
        this.size = size;
        this.memory = new Array(size).fill(0);
    }
}
function getMemory(size) {
    return new Memory(size);
}
function main() {
    const memory = getMemory(1024);
    // console.log(memory);
}
main();

module.exports = Memory;
