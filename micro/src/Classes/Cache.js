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

function main() {
    // Create a cache with:
    // - 64-byte blocks
    // - 1024-byte (1KB) total cache size
    // - 1 cycle hit latency
    // - 10 cycles miss penalty
    const cache = new Cache(64, 1024, 1, 10);
    
    console.log("Cache Configuration:");
    console.log(`Block Size: ${cache.blockSize} bytes`);
    console.log(`Cache Size: ${cache.cacheSize} bytes`);
    console.log(`Number of Blocks: ${cache.numBlocks}`);
    console.log("\n");

    // Perform some example operations
    console.log("Performing cache operations:");
    
    // Read some words from different addresses
    console.log("\n1. Reading word from address 0:");
    let result1 = cache.readWord(0);
    console.log("Result:", result1);

    console.log("\n2. Reading word from address 4:");
    let result2 = cache.readWord(4);
    console.log("Result:", result2);

    console.log("\n3. Reading double from address 8:");
    let result3 = cache.readDouble(8);
    console.log("Result:", result3);

    // Read from same address again to demonstrate cache hit
    console.log("\n4. Reading word from address 0 again (should be a hit):");
    let result4 = cache.readWord(0);
    console.log("Result:", result4);

    // Read from an address in a different cache block
    console.log("\n5. Reading word from address 128 (should be a miss):");
    let result5 = cache.readWord(128);
    console.log("Result:", result5);

    // Print cache statistics
    console.log("\nCache Statistics:");
    const stats = cache.getStats();
    console.log(`Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%`);
    console.log(`Miss Rate: ${(stats.missRate * 100).toFixed(2)}%`);
    console.log(`Total Accesses: ${stats.totalAccesses}`);
    console.log(`Hits: ${stats.hits}`);
    console.log(`Misses: ${stats.misses}`);
}

// Run the main function
main();