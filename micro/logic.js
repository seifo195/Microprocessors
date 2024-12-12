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