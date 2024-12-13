import './App.css';
import MultRS from './Components/MultRS.js';
import AddRS from './Components/AddRS.js';
import Regfile from './Components/Regfile.js';
import InstructionQueue from './Components/instructionqeueu.js';
import Load from './Components/Load.js';
import Store from './Components/Store.js'; 
import Cache from './Components/Cache.js';
import { useState } from 'react';
import { Processor } from './Classes/Processor.js';

function App() {
  const [processor, setProcessor] = useState(null);
  const [config, setConfig] = useState({
    addStations: 3,
    mulStations: 2,
    loadBuffers: 3,
    storeBuffers: 3,
    cacheSize: 128,
    blockSize: 16
  });
  const [processorState, setProcessorState] = useState(null);

  // Initialize processor when config changes
  const initializeProcessor = () => {
    const newProcessor = new Processor(config);
    
    // Pre-load test values
    newProcessor.cache.Insertintomemory(100, 50);
    newProcessor.cache.Insertintomemory(104, 30);
    newProcessor.registerFile.integer[1] = 100;
    newProcessor.registerFile.floating[2] = 10.0;
    newProcessor.registerFile.floating[4] = 20.0;

    // Add test instructions
    newProcessor.instructionQueue = [
      { type: 'ADD.D', dest: 'F6', src1: 'F2', src2: 'F4' },
      { type: 'S.D', src: 'F6', address: 100 },
      { type: 'ADD.D', dest: 'F8', src1: 'F6', src2: 'F2' }
    ];

    setProcessor(newProcessor);
    setProcessorState(newProcessor.updateStatus());
  };

  // Update processor state after each cycle
  const handleNextCycle = () => {
    if (processor) {
      processor.cycle();
      const newState = {
        clock: processor.clock,
        addStations: processor.addStations,
        mulStations: processor.mulStations,
        loadBuffers: processor.loadBuffers,
        storeBuffers: processor.storeBuffers,
        cache: processor.cache,
        registers: processor.registerFile,
        instructionQueue: processor.instructionQueue
      };
      setProcessorState(newState);
    }
  };

  // Handle configuration changes
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  return (
    <div className="app-container">
      <div className="config-section">
        <h2>Processor Configuration</h2>
        <div className="config-inputs">
          <label>
            Add Stations:
            <input
              type="number"
              name="addStations"
              value={config.addStations}
              onChange={handleConfigChange}
            />
          </label>
          <label>
            Multiply Stations:
            <input
              type="number"
              name="mulStations"
              value={config.mulStations}
              onChange={handleConfigChange}
            />
          </label>
          <label>
            Load Buffers:
            <input
              type="number"
              name="loadBuffers"
              value={config.loadBuffers}
              onChange={handleConfigChange}
            />
          </label>
          <label>
            Store Buffers:
            <input
              type="number"
              name="storeBuffers"
              value={config.storeBuffers}
              onChange={handleConfigChange}
            />
          </label>
          <label>
            Cache Size (bytes):
            <input
              type="number"
              name="cacheSize"
              value={config.cacheSize}
              onChange={handleConfigChange}
            />
          </label>
          <label>
            Block Size (bytes):
            <input
              type="number"
              name="blockSize"
              value={config.blockSize}
              onChange={handleConfigChange}
            />
          </label>
        </div>
        <button onClick={initializeProcessor}>Initialize Processor</button>
      </div>

      {processor && (
        <>
          <button 
            onClick={handleNextCycle}
            className="next-cycle-button"
          >
            Next Cycle ({processorState?.clock || 0})
          </button>

          <div className="processor-state">
            <InstructionQueue 
              instructions={processorState?.instructionQueue || []}
              latencies={config.latencies}
            />
            
            <div className="stations-container">
              <Load 
                stationSize={config.loadBuffers} 
                stations={processorState?.loadBuffers || []}
              />
              <Store 
                stationSize={config.storeBuffers} 
                stations={processorState?.storeBuffers || []}
              />
              <AddRS 
                stationSize={config.addStations} 
                stations={processorState?.addStations || []}
              />
              <MultRS 
                stationSize={config.mulStations} 
                stations={processorState?.mulStations || []}
              />
            </div>

            <div className="memory-container">
              <Regfile registers={processorState?.registers || {}} />
              <Cache 
                cache={processorState?.cache}
                cacheSize={config.cacheSize}
                blockSize={config.blockSize}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;