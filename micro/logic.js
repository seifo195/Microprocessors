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
class AdditionReservationStation{
    constructor(busy,operation,Vi,Vj,Qi,Qj,A,time){
        this.busy=busy;
        this.operation=operation;
        this.Vi=Vi;
        this.Vj=Vj;
        this.Qi=Qi;
        this.Qj=Qj;
        this.A=A;
        this.time=time;
    }
}
class MultiplicationReservationStation{
    constructor(busy,operation,Vi,Vj,Qi,Qj,A,time){
        this.busy=busy;
        this.operation=operation;
        this.Vi=Vi;
        this.Vj=Vj;
        this.Qi=Qi;
        this.Qj=Qj;
        this.A=A;
        this.time=time;
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
    constructor(size, blockSize, associativity = 1, hitLatency = 1, missPenalty = 10) {
        this.size = size;                  // Total number of blocks in the cache
        this.blockSize = blockSize;        // Number of words in each block
        this.associativity = associativity; // Associativity level (1 = direct-mapped, size = fully associative)
        this.hitLatency = hitLatency;      // Cycles for a cache hit
        this.missPenalty = missPenalty;    // Cycles for a cache miss
        this.cache = this.initializeCache();
        this.accessHistory = [];           // For replacement policy (e.g., LRU)
    }

    initializeCache() {
        const numSets = this.size / this.associativity;
        return Array.from({ length: numSets }, () => 
            Array.from({ length: this.associativity }, () => ({
                tag: null,
                validityBit: 0,
                block: new Array(this.blockSize).fill(0)
            }))
        );
    }

    calculateIndexAndTag(address) {
        const numSets = this.size / this.associativity;
        const blockOffsetBits = Math.log2(this.blockSize);
        const indexBits = Math.log2(numSets);
        const blockOffsetMask = (1 << blockOffsetBits) - 1;
        const indexMask = (1 << indexBits) - 1;

        const blockOffset = address & blockOffsetMask;
        const index = (address >> blockOffsetBits) & indexMask;
        const tag = address >> (blockOffsetBits + indexBits);

        return { tag, index, blockOffset };
    }

    access(address) {
        const { tag, index, blockOffset } = this.calculateIndexAndTag(address);
        const set = this.cache[index];

        // Check for hit
        for (const block of set) {
            if (block.validityBit && block.tag === tag) {
                return { hit: true, data: block.block[blockOffset], cycles: this.hitLatency };
            }
        }

        // Handle miss
        const blockToReplace = this.selectBlockToReplace(set);
        this.replaceBlock(blockToReplace, tag, address);
        return { hit: false, data: null, cycles: this.missPenalty };
    }

    selectBlockToReplace(set) {
        // LRU replacement policy
        for (const block of set) {
            if (!block.validityBit) return block; // Empty block
        }

        // Fall back to replacing the least recently used block
        const lruBlock = set.reduce((prev, curr) => 
            (this.accessHistory[prev.tag] < this.accessHistory[curr.tag] ? prev : curr)
        );
        return lruBlock;
    }

    replaceBlock(block, tag, address) {
        block.tag = tag;
        block.validityBit = 1;
        block.block = this.fetchDataFromMemory(address);
        this.accessHistory[tag] = Date.now(); // Update access timestamp
    }

    fetchDataFromMemory(address) {
        return new Array(this.blockSize).fill(0); // Simulate memory fetch
    }
}

class commonDataBus{
    constructor(tag,content){
        this.tag=tag;
        this.content=content;
    }
}