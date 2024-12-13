// Cache
class Cache {

    constructor(blockSize, cacheSize, hitLatency = 1, missPenalty = 10) {
        // Size in bytes
        this.blockSize = blockSize;
        this.cacheSize = cacheSize;
        this.numBlocks = Math.floor(cacheSize / blockSize);
        this.memory = new Array(cacheSize).fill(null);
        // Timing parameters
        this.hitLatency = hitLatency;
        this.missPenalty = missPenalty;
        this.Cache = new Array(this.numBlocks).fill(null).map(() => new Array(this.blockSize).fill(null));
        
        // Statistics
        this.hits = 0;
        this.misses = 0;
        this.accessCount = 0;
    }
    initCache() {
        this.Cache = new Array(this.numBlocks).fill(null).map(() => new Array(this.blockSize).fill(null));
    }
   
    Insertintomemory(address,value) {
        this.memory[address-1] = value;
    }// indixed from 0


    // New method to load a block into the cache from memory
    loadBlockIntoCache(address) {
        const blockAddress = this.getBlockAddress(address); // Get the block address
        const blockData = this.loadFromMemory(blockAddress, this.blockSize); // Load data from memory
        const index = this.getIndex(blockAddress); // Get the index in the cache

        // Store the loaded block in the cache
        this.cache[index] = blockData;
        console.log(`Loaded block from memory address ${blockAddress} into cache at index ${index}`);
    }


    getBlockAddress(address) {
        // start from 0
        return Math.floor(address / this.blockSize);
    }
    getIndex(address) {
        // start from 0
        let blockAddress = this.getBlockAddress(address);
        return (address - (blockAddress*this.blockSize));
    }

    cacheGet(instruction,address) {
        let flag = true;
        let blockAddress = this.getBlockAddress(address);
        let index = this.getIndex(address);
        if (instruction.type === "LW" || instruction.type === "L.w") {
            // Check if the 8 values starting from the address are not null
            // min 8bytes will be brought to cache in case of miss
            if(this.Cache[blockAddress][index]!== null) {
                for(let i = 0; i < 8; i++) {
            }
            // If all values are not null, proceed with cache hit logic
            if(this.cache[address] !== null) {
                
                return this.cache[address];
            }
        }else if (instruction.type === "LD" || instruction.type === "L.D") {
            this.cache[address] = value;
        }
     



    }

    }
    // cacheSet(address, value) {
    //     this.cache[address] = value;
    // }




}

//     // Modified to handle word-aligned addresses
//     getWordAddress(byteAddress) {
//         return Math.floor(byteAddress / 4) * 4;
//     }

//     // Modified to handle block-aligned addresses
//     getBlockAddress(byteAddress) {
//         return Math.floor(byteAddress / this.blockSize) * this.blockSize;
//     }

//     // Get block index from address
//     getIndex(address) {
//         return Math.floor((address / this.blockSize) % this.numBlocks);
//     }

//     // Get tag from address
//     getTag(address) {
//         return Math.floor(address / (this.blockSize * this.numBlocks));
//     }

//     // New method to read a word (4 bytes)
//     readWord(address) {
//         const wordAddress = this.getWordAddress(address);
//         const result = this.access(wordAddress, 4, false);
//         return {
//             data: result.data,
//             cycles: result.cycles,
//             hit: result.hit
//         };
//     }

//     // New method to read a double word (8 bytes)
//     readDouble(address) {
//         const wordAddress = this.getWordAddress(address);
//         const result = this.access(wordAddress, 8, false);
//         return {
//             data: result.data,
//             cycles: result.cycles,
//             hit: result.hit
//         };
//     }

//     // Modified access method to handle different sizes and write operations
//     access(address, size = 4, isWrite = false) {
//         this.accessCount++;
//         const index = this.getIndex(address);
//         const tag = this.getTag(address);
//         const block = this.blocks[index];
//         const blockOffset = address % this.blockSize;

//         // Cache hit
//         if (block.valid && block.tag === tag) {
//             this.hits++;
//             block.lastUsed = this.accessCount;
            
//             const data = block.data.slice(blockOffset, blockOffset + size);
//             if (isWrite) {
//                 block.dirty = true;
//             }
            
//             return {
//                 hit: true,
//                 cycles: this.hitLatency,
//                 data: data
//             };
//         }

//         // Cache miss
//         this.misses++;
        
//         // Handle dirty block eviction if necessary
//         if (block.valid && block.dirty) {
//             this.writeBackToMemory(block);
//         }
        
//         // Load new block from memory
//         const blockAddress = this.getBlockAddress(address);
//         this.blocks[index] = {
//             valid: true,
//             tag: tag,
//             data: this.loadFromMemory(blockAddress, this.blockSize),
//             lastUsed: this.accessCount,
//             dirty: isWrite,
//             blockAddress: blockAddress
//         };

//         const data = this.blocks[index].data.slice(blockOffset, blockOffset + size);
        
//         return {
//             hit: false,
//             cycles: this.missPenalty,
//             data: data
//         };
//     }

//     // New method to simulate writing back to memory
//     writeBackToMemory(block) {
//         console.log(`Writing back block at address ${block.blockAddress} to memory`);
//         // In a real implementation, this would write to main memory
//     }

//     // Modified to simulate more realistic memory access
//     loadFromMemory(address, size) {
//         console.log(`Loading ${size} bytes from memory address ${address}`);
//         // Simulate memory access delay
//         return new Array(size).fill(0).map((_, i) => {
//             // Simulate some pattern based on address for debugging
//             return (address + i) % 256;
//         });
//     }

//     // Enhanced statistics
//     getStats() {
//         return {
//             hits: this.hits,
//             misses: this.misses,
//             hitRate: this.hits / (this.hits + this.misses || 1),
//             totalAccesses: this.accessCount,
//             missRate: this.misses / (this.hits + this.misses || 1)
//         };
//     }

//     // Modified clear method to reset all state
//     clear() {
//         this.blocks.forEach(block => {
//             block.valid = false;
//             block.tag = null;
//             block.data.fill(0);
//             block.lastUsed = 0;
//             block.dirty = false;
//             block.blockAddress = null;
//         });
//         this.hits = 0;
//         this.misses = 0;
//         this.accessCount = 0;
//     }
// }
        
function main() {
    // Create a cache with:
    // - 64-byte blocks
    // - 1024-byte (1KB) total cache size
    // - 1 cycle hit latency
    // - 10 cycles miss penalty
    const cache = new Cache(64, 128, 1, 10);
    // cache.getBlockAddress(100);
    // cache.getIndex(100);
    const blockAddress = cache.getBlockAddress(100);
    const index = cache.getIndex(100);
    console.log(`Block Address for 100: ${blockAddress}`);
    console.log(`Index for 100: ${index}`);
    // cache.initCache();
    // console.log(cache);

// 8-bit representation example
function toBinary8Bit(num) {
    if (num >= 0) {
        return num.toString(2).padStart(8, '0');
    } else {
        // For negative numbers, convert to 8-bit two's complement
        return ((1 << 8) + num).toString(2).slice(-8);
    }
}

console.log(toBinary8Bit(42));    // "00101010"
console.log(toBinary8Bit(-42));   // "11010110"
    // console.log("Cache Configuration:");
    // console.log(`Block Size: ${cache.blockSize} bytes`);
    // console.log(`Cache Size: ${cache.cacheSize} bytes`);
    // console.log(`Number of Blocks: ${cache.numBlocks}`);
    // console.log("\n");

    // // Perform some example operations
    // console.log("Performing cache operations:");
    
    // // Read some words from different addresses
    // console.log("\n1. Reading word from address 0:");
    // let result1 = cache.readWord(0);
    // console.log("Result:", result1);

    // console.log("\n2. Reading word from address 4:");
    // let result2 = cache.readWord(4);
    // console.log("Result:", result2);

    // console.log("\n3. Reading double from address 8:");
    // let result3 = cache.readDouble(8);
    // console.log("Result:", result3);

    // // Read from same address again to demonstrate cache hit
    // console.log("\n4. Reading word from address 0 again (should be a hit):");
    // let result4 = cache.readWord(0);
    // console.log("Result:", result4);

    // // Read from an address in a different cache block
    // console.log("\n5. Reading word from address 128 (should be a miss):");
    // let result5 = cache.readWord(128);
    // console.log("Result:", result5);

    // // Print cache statistics
    // console.log("\nCache Statistics:");
    // const stats = cache.getStats();
    // console.log(`Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%`);
    // console.log(`Miss Rate: ${(stats.missRate * 100).toFixed(2)}%`);
    // console.log(`Total Accesses: ${stats.totalAccesses}`);
    // console.log(`Hits: ${stats.hits}`);
    // console.log(`Misses: ${stats.misses}`);
}

// Run the main function
// main();
// 1024

// LD r1, 100 ->103

// blockSize = 4

//  1 2 3 4 5
// [0,1,2,3,4]
 
// ld r1, 100

// for (int i = 0; i < 4; i++) {
//     cache.access(100 + i, 4, false); }
module.exports = Cache;