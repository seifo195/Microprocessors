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
        const index = this.getIndex(address); // Get the index in the cache

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
    
    
    toBinary8Bit(num) {
        if (num >= 0) {
            return num.toString(2).padStart(8, '0');
        } else {
            // For negative numbers, convert to 8-bit two's complement
            return ((1 << 8) + num).toString(2).slice(-8);
        }
    }

    loadBlockIntoCache(address) {
        const blockAddress = this.getBlockAddress(address);
        
        // Ensure the cache block exists
        if (!this.Cache[blockAddress]) {
            this.Cache[blockAddress] = new Array(this.blockSize).fill(null);
        }
    
        // Load entire block from memory
        const blockData = [];
        for (let i = 0; i < this.blockSize; i++) {
            const memoryAddress = blockAddress * this.blockSize + i;
            // Ensure memory address is within bounds
            const byteValue = memoryAddress < this.memory.length ? 
                this.memory[memoryAddress] : 
                null;
            blockData.push(byteValue);
        }
    
        // Store the block in the cache
        this.Cache[blockAddress] = blockData;
        
        console.log(`Loaded block from memory address ${blockAddress} into cache`);
    }

    cacheGet(instruction, address, value = null) {
        // Add bounds checking at the start
        if (address < 0 || address >= this.memory.length) {
            return {
                data: 0n,
                isHit: false,
                penalty: this.missPenalty,
                error: "Address out of bounds"
            };
        }

        // Determine the number of bytes and operation type
        const bytesToCheck = instruction.type === "LW" || instruction.type === "L.w" ? 4 : 
                             instruction.type === "LD" || instruction.type === "L.D" ? 8 : 
                             instruction.type === "SW" || instruction.type === "S.w" ? 4 :
                             instruction.type === "SD" || instruction.type === "S.D" ? 8 : 
                             1; // default to 1 byte if unknown instruction
    
        // Determine if it's a load or store operation
        const isLoadOperation = instruction.type.startsWith('L');
        const isStoreOperation = instruction.type.startsWith('S');
    
        // Calculate the block address and starting index
        const blockAddress = this.getBlockAddress(address);
        const startIndex = this.getIndex(address);
    
        // Handle store operations first
        if (isStoreOperation) {
            // Convert value to bytes
            const bytes = this.convertValueToBytes(value, bytesToCheck);
            
            // Check if the block exists in cache
            const isCacheMiss = !this.Cache[blockAddress];

            // If cache miss, write to memory first
            if (isCacheMiss) {
                // Write to memory
                for (let i = 0; i < bytesToCheck; i++) {
                    const currentAddress = address + i;
                    this.Insertintomemory(currentAddress + 1, bytes[i]);
                }

                // Load the block into cache (includes the data we just wrote)
                this.loadBlockIntoCache(address);
                this.misses++;
                this.accessCount++;

                return {
                    data: value,
                    isHit: false,
                    penalty: this.missPenalty
                };
            }
            
            // Cache hit: Store in both cache and memory
            for (let i = 0; i < bytesToCheck; i++) {
                const currentAddress = address + i;
                const currentBlockAddress = this.getBlockAddress(currentAddress);
                const currentIndex = this.getIndex(currentAddress);
    
                // Store byte in cache
                this.Cache[currentBlockAddress][currentIndex] = bytes[i];
    
                // Store byte in memory
                this.Insertintomemory(currentAddress + 1, bytes[i]);
            }
            
            this.hits++;
            this.accessCount++;
            return {
                data: value,
                isHit: true,
                penalty: this.hitLatency
            };
        }
    
        // Handle load operations
        // Check if all required bytes exist in the cache
        let allBytesInCache = true;
        for (let i = 0; i < bytesToCheck; i++) {
            const currentAddress = address + i;
            const currentBlockAddress = this.getBlockAddress(currentAddress);
            const currentIndex = this.getIndex(currentAddress);
    
            // Ensure the block exists and the specific index is not null
            if (!this.Cache[currentBlockAddress] || 
                this.Cache[currentBlockAddress][currentIndex] === null) {
                allBytesInCache = false;
                break;
            }
        }
    
        // Handle cache hit or miss for load operations
        if (allBytesInCache) {
            // Cache hit: Increment hits and return the data
            this.hits++;
            this.accessCount++;
            
            // Read the requested number of bytes from cache
            let intValue = 0;
            for (let i = 0; i < bytesToCheck; i++) {
                const currentAddress = address + i;
                const currentBlockAddress = this.getBlockAddress(currentAddress);
                const currentIndex = this.getIndex(currentAddress);
                
                // Assumes big-endian representation
                intValue = (intValue << 8) | Number(this.Cache[currentBlockAddress][currentIndex]);
            }
    
            return {
                data: intValue,
                isHit: true,
                penalty: this.hitLatency
            };
        } else {
            this.misses++;
            this.accessCount++;
    
            // Load the block containing the address into cache
            this.loadBlockIntoCache(address);
    
            // After loading the block, read the data from cache
            let intValue = 0;
            try {
                for (let i = 0; i < bytesToCheck; i++) {
                    const currentAddress = address + i;
                    const currentBlockAddress = this.getBlockAddress(currentAddress);
                    const currentIndex = this.getIndex(currentAddress);
                    
                    // Handle null values in cache by treating them as 0
                    const byteValue = this.Cache[currentBlockAddress]?.[currentIndex] ?? 0;
                    
                    // Reconstruct integer by shifting and adding bytes
                    intValue = (intValue << 8) | Number(byteValue);
                }
            } catch (error) {
                console.warn(`Warning: Error processing address ${address}:`, error);
                intValue = 0;
            }
    
            return {
                data: intValue,
                isHit: false,
                penalty: this.missPenalty
            };
        }
    }
    // Helper method to convert value to bytes
    convertValueToBytes(value, numBytes) {
        const bytes = [];
        let tempValue = Number(value); // Convert to regular number

        for (let i = 0; i < numBytes; i++) {
            bytes.push(tempValue & 0xFF);
            tempValue = tempValue >> 8;
        }
        return bytes;
    }

    convertBytesToValue(bytes) {
        let value = 0;
        for (let i = bytes.length - 1; i >= 0; i--) {
            value = (value << 8) | bytes[i];
        }
        return value;
    }
 
    getMemoryValue(address) {
        // Adjust address to be 0-based since memory is 0-indexed
        const adjustedAddress = address - 1;
        
        // Check if address is valid
        if (adjustedAddress < 0 || adjustedAddress >= this.memory.length) {
            console.warn(`Address ${address} is out of bounds`);
            return null;
        }

        return this.memory[adjustedAddress];
    }

}

 
        
function main() {

    const cache = new Cache(64, 128, 1, 10);
    // cache.getBlockAddress(100);
    // cache.getIndex(100);
    const blockAddress = cache.getBlockAddress(100);
    const index = cache.getIndex(100);
    console.log(`Block Address for 100: ${blockAddress}`);
    console.log(`Index for 100: ${index}`);
    // cache.initCache();
    // console.log(cache);

// 8-bit representation exampl
const pos = cache.toBinary8Bit(42);
const neg = cache.toBinary8Bit(-42);
console.log(pos);   
console.log(neg);  
   
}

// Create a cache instance
const blockSize = 8;  // 8 bytes per block
const cacheSize = 64; // 64 bytes total cache size
const cache = new Cache(blockSize, cacheSize);

// Populate memory with some test data
function populateMemory() {
    // Fill memory with some sample byte values
    for (let i = 0; i < 100; i++) {
        cache.Insertintomemory(i, i % 256);  // Insert byte values 0-255 cycling
    }
}

// Test function to simulate cache access
function testCacheAccess() {
    // Populate memory first
    populateMemory();

    // Test scenarios
    const testCases = [
        // Load Operations
        { 
            description: "First LW Load (Cache Miss)",
            instruction: { type: "LW" }, 
            address: 0 
        },
        { 
            description: "Second LW Load (Cache Hit)",
            instruction: { type: "LW" }, 
            address: 0 
        },
        { 
            description: "LD Load (Cache Miss)",
            instruction: { type: "LD" }, 
            address: 16 
        },
        { 
            description: "L.w Load (Cache Miss)",
            instruction: { type: "L.w" }, 
            address: 32 
        },
        { 
            description: "Accessing Boundary (Cache Miss)",
            instruction: { type: "LW" }, 
            address: 63 // Edge of cache
        },
        { 
            description: "Accessing Out of Bounds (Cache Miss)",
            instruction: { type: "LW" }, 
            address: 100 // Beyond cache size
        },
        { 
            description: "SW Store Operation",
            instruction: { type: "SW" }, 
            address: 64,
            value: 0x12345678 
        },
        { 
            description: "SD Store Operation",
            instruction: { type: "SD" }, 
            address: 80,
            value: 0x1122334455667788n 
        },
        { 
            description: "Load from Empty Cache (Cache Miss)",
            instruction: { type: "LW" }, 
            address: 128 // Address not populated
        },
        { 
            description: "Load with Different Data Type (Cache Miss)",
            instruction: { type: "LD" }, 
            address: 8 
        },
        { 
            description: "Load with Invalid Address (Cache Miss)",
            instruction: { type: "LW" }, 
            address: -1 // Invalid address
        }
    ];

    // Track total penalty
    let totalPenalty = 0;

    // Run tests
    testCases.forEach((testCase, index) => {
        console.log(`\nTest Case ${index + 1}: ${testCase.description}`);
        
        // Prepare the call parameters
        const params = testCase.value !== undefined 
            ? [testCase.instruction, testCase.address, testCase.value]
            : [testCase.instruction, testCase.address];

        try {
            // Perform cache access
            const result = cache.cacheGet(...params);
            
            // Log detailed results
            console.log("Result:", result);
            console.log(`Block Address: ${cache.getBlockAddress(testCase.address)}`);
            console.log(`Index in Block: ${cache.getIndex(testCase.address)}`);
            
            // Accumulate penalty
            totalPenalty += result.penalty;
        } catch (error) {
            console.error("Error in test case:", error);
        }
    });

    // Print cache statistics
    console.log("\nCache Statistics:");
    console.log(`Total Accesses: ${cache.accessCount}`);
    console.log(`Hits: ${cache.hits}`);
    console.log(`Misses: ${cache.misses}`);
    console.log(`Hit Ratio: ${(cache.hits / cache.accessCount * 100).toFixed(2)}%`);
    console.log(`Total Penalty: ${totalPenalty}`);
}

// Run the test
// testCacheAccess();
module.exports = Cache;