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
import { parseInstruction } from './instructionParser.js';

function App() {
  const [processor, setProcessor] = useState(null);
  const [config, setConfig] = useState({
    addStations: 3,
    mulStations: 2,
    loadBuffers: 3,
    storeBuffers: 3,
    cacheSize: 128,
    blockSize: 16,
    latencies: {
      'ADD.D': 2,
      'SUB.D': 2,
      'MUL.D': 10,
      'DIV.D': 40,
      'L.D': 2,
      'S.D': 2,
      'ADD.S': 2,
      'SUB.S': 2,
      'MUL.S': 10,
      'DIV.S': 40,
      'L.S': 2,
      'S.S': 2
    }
  });
  const [processorState, setProcessorState] = useState(null);

  // Add file handling function
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const instructions = text
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            const parsedInstruction = parseInstruction(line.trim());
            // Convert parsed instruction to processor format
            const processorInstruction = {
              type: parsedInstruction.opcode,
            };

            // Handle different instruction types
            switch (parsedInstruction.opcode) {
              case 'LW':
              case 'LD':
              case 'L.S':
              case 'L.D':
                processorInstruction.dest = parsedInstruction.rd;
                if (parsedInstruction.rs) {
                  // Base register addressing
                  processorInstruction.baseReg = parsedInstruction.rs;
                  processorInstruction.offset = parsedInstruction.immediate;
                } else {
                  // Direct addressing
                  processorInstruction.address = parsedInstruction.immediate;
                }
                break;

              case 'SW':
              case 'SD':
              case 'S.S':
              case 'S.D':
                processorInstruction.src = parsedInstruction.rt;
                if (parsedInstruction.rs) {
                  // Base register addressing
                  processorInstruction.baseReg = parsedInstruction.rs;
                  processorInstruction.offset = parsedInstruction.immediate;
                } else {
                  // Direct addressing
                  processorInstruction.address = parsedInstruction.immediate;
                }
                break;

              case 'BNE':
              case 'BEQ':
                processorInstruction.src1 = parsedInstruction.rs;
                processorInstruction.src2 = parsedInstruction.rt;
                processorInstruction.label = parsedInstruction.immediate;
                break;

              case 'DADDI':
              case 'DSUBI':
                processorInstruction.dest = parsedInstruction.rd;
                processorInstruction.src1 = parsedInstruction.rs;
                processorInstruction.immediate = parsedInstruction.immediate;
                break;

              default:
                // Handle arithmetic instructions
                processorInstruction.dest = parsedInstruction.rd;
                processorInstruction.src1 = parsedInstruction.rs;
                processorInstruction.src2 = parsedInstruction.rt;
                break;
            }

            return processorInstruction;
          });
        
        // Initialize processor with the parsed instructions
        initializeProcessor(instructions);
      };
      reader.readAsText(file);
    }
  };

  // Modify initialize processor to accept instructions
  const initializeProcessor = (instructions = []) => {
    const newProcessor = new Processor(config);
    
    // Pre-load register values
    newProcessor.registerFile.integer[1] = 100;  // R1 = 100
    newProcessor.registerFile.integer[2] = 200;  // R2 = 200
    newProcessor.registerFile.integer[3] = 300;  // R3 = 300
    
    newProcessor.registerFile.floating[2] = 10.0;  // F2 = 10.0
    newProcessor.registerFile.floating[4] = 20.0;  // F4 = 20.0
    newProcessor.registerFile.floating[6] = 30.0;  // F6 = 30.0
    newProcessor.registerFile.floating[8] = 40.0;  // F8 = 40.0

    // Pre-load memory values
    newProcessor.cache.Insertintomemory(100, 50);
    newProcessor.cache.Insertintomemory(104, 30);
    newProcessor.cache.Insertintomemory(108, 70);
    newProcessor.cache.Insertintomemory(112, 90);

    // Use provided instructions or fallback to default ones
    const initialInstructions = instructions.length > 0 ? instructions : [
      { type: 'ADD.D', dest: 'F6', src1: 'F2', src2: 'F4' },
      { type: 'MUL.D', dest: 'F8', src1: 'F6', src2: 'F2' },
      { type: 'S.D', src: 'F8', address: 100 },
      { type: 'L.D', dest: 'F10', address: 104 },
      { type: 'ADD.D', dest: 'F6', src1: 'F10', src2: 'F8' }
    ];

    newProcessor.instructionQueue = [...initialInstructions];
    
    setProcessor(newProcessor);
    setProcessorState(newProcessor.updateStatus());
  };

  // Update processor state after each cycle
  const handleNextCycle = () => {
    if (processor) {
      processor.cycle();
      setProcessorState(processor.updateStatus());
    }
  };

  // Handle configuration changes including latencies
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle latency changes
      setConfig(prev => ({
        ...prev,
        latencies: {
          ...prev.latencies,
          [name]: parseInt(value, 10)
        }
      }));
    } else {
      // Handle other config changes
      setConfig(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    }
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

        <h3>Operation Latencies</h3>
        <div className="latency-section">
          <div className="latency-group">
            <h4>Double Precision</h4>
            <label>
              ADD.D:
              <input
                type="number"
                name="ADD.D"
                value={config.latencies['ADD.D']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              SUB.D:
              <input
                type="number"
                name="SUB.D"
                value={config.latencies['SUB.D']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              MUL.D:
              <input
                type="number"
                name="MUL.D"
                value={config.latencies['MUL.D']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              DIV.D:
              <input
                type="number"
                name="DIV.D"
                value={config.latencies['DIV.D']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
          </div>

          <div className="latency-group">
            <h4>Single Precision</h4>
            <label>
              ADD.S:
              <input
                type="number"
                name="ADD.S"
                value={config.latencies['ADD.S']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              SUB.S:
              <input
                type="number"
                name="SUB.S"
                value={config.latencies['SUB.S']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              MUL.S:
              <input
                type="number"
                name="MUL.S"
                value={config.latencies['MUL.S']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              DIV.S:
              <input
                type="number"
                name="DIV.S"
                value={config.latencies['DIV.S']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
          </div>

          <div className="latency-group">
            <h4>Memory Operations</h4>
            <label>
              L.D:
              <input
                type="number"
                name="L.D"
                value={config.latencies['L.D']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              S.D:
              <input
                type="number"
                name="S.D"
                value={config.latencies['S.D']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              L.S:
              <input
                type="number"
                name="L.S"
                value={config.latencies['L.S']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
            <label>
              S.S:
              <input
                type="number"
                name="S.S"
                value={config.latencies['S.S']}
                onChange={handleConfigChange}
                min="1"
              />
            </label>
          </div>
        </div>

        <div className="file-upload-section">
          <label>
            Upload Instructions File:
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="file-input"
            />
          </label>
        </div>

        <button onClick={() => initializeProcessor()}>Initialize Processor</button>
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