import './App.css';
import MultRS from './Components/MultRS.js';
import AddRS from './Components/AddRS.js';
import Regfile from './Components/Regfile.js';
import InstructionQueue from './Components/instructionqeueu.js';
import Load from './Components/Load.js';
import Store from './Components/Store.js'; 
import { useState, useEffect } from 'react';
import { TomasuloController } from './logic/logic.js';
import { parseInstruction } from './instructionParser.js';

function App() {
  const [controller] = useState(() => new TomasuloController());
  const [stationSizes, setStationSizes] = useState({
    load: 3,
    store: 3,
    add: 4,
    mult: 5
  });
  const [cacheConfig, setCacheConfig] = useState({
    cacheSize: 4096,
    blockSize: 64
  });

  // Add temporary state for input values
  const [tempConfig, setTempConfig] = useState({
    cacheSize: 4096,
    blockSize: 64,
    load: 3,
    store: 3,
    add: 4,
    mult: 5
  });

  const [instructions, setInstructions] = useState([]);
  const [parsedInstructions, setParsedInstructions] = useState([]);

  // Function to handle applying all changes
  const handleApplyChanges = () => {
    setStationSizes({
      load: tempConfig.load,
      store: tempConfig.store,
      add: tempConfig.add,
      mult: tempConfig.mult
    });
    setCacheConfig({
      cacheSize: tempConfig.cacheSize,
      blockSize: tempConfig.blockSize
    });
  };

  // Update input handlers to modify temporary state
  const handleTempChange = (type, value) => {
    setTempConfig(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  // Add this function to handle new instructions
  const handleNewInstruction = (instructionString) => {
    const parsedInstruction = parseInstruction(instructionString);
    setParsedInstructions(prev => [...prev, parsedInstruction]);
  };

  const options = [
    // Integer ALU operations
    'DADDI',
    'DSUBI',
    // Floating point operations
    'ADD.D',
    'ADD.S',
    'SUB.D',
    'SUB.S',
    'MUL.D',
    'MUL.S',
    'DIV.D',
    'DIV.S',
    // Memory operations
    'LW',
    'LD',
    'L.S',
    'L.D',
    'SW',
    'SD',
    'S.S',
    'S.D',
    // Branch operations
    'BNE',
    'BEQ'
  ];
  
  // Log updated station sizes and cache config after they change
  useEffect(() => {
    console.log('Updated station sizes:', {
      'Add RS': stationSizes.add,
      'Mult RS': stationSizes.mult,
      'Load RS': stationSizes.load,
      'Store RS': stationSizes.store
    });

    console.log('Updated cache config:', {
      'Cache Size': cacheConfig.cacheSize,
      'Block Size': cacheConfig.blockSize
    });
  }, [stationSizes, cacheConfig]);

  const handleConfigUpdate = (newConfig) => {
    // Log the new configuration
    console.log('Applying new configuration:');
    console.log({
      'Add RS Size': newConfig.add,
      'Multiply RS Size': newConfig.mult,
      'Load RS Size': newConfig.load,
      'Store RS Size': newConfig.store,
      'Cache Size (bytes)': newConfig.cacheSize,
      'Block Size (bytes)': newConfig.blockSize
    });

    // Update the controller
    controller.updateConfiguration({
      addStations: newConfig.add,
      multStations: newConfig.mult,
      loadStations: newConfig.load,
      storeStations: newConfig.store,
      cacheSize: newConfig.cacheSize,
      blockSize: newConfig.blockSize
    });

    // Update local UI state
    setStationSizes({
      load: newConfig.load,
      store: newConfig.store,
      add: newConfig.add,
      mult: newConfig.mult
    });

    setCacheConfig({
      cacheSize: newConfig.cacheSize,
      blockSize: newConfig.blockSize
    });
  };

  const handleLatencyUpdate = (newLatencies) => {
    controller.updateLatencies(newLatencies);
    // Force a re-render or update state as needed
  };

  return (
    <div className="App">   
      <h1>Tomasulo Algorithm Simulator</h1>
      
      <div className="config-controls">
        <div className="input-group">
          <label htmlFor="cacheSize">Cache Size (bytes):</label>
          <input 
            type="number" 
            id="cacheSize" 
            min="1"
            step="1024"
            value={tempConfig.cacheSize}
            onChange={(e) => handleTempChange('cacheSize', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="blockSize">Block Size (bytes):</label>
          <input 
            type="number" 
            id="blockSize" 
            min="1"
            step="16"
            value={tempConfig.blockSize}
            onChange={(e) => handleTempChange('blockSize', e.target.value)}
          />
        </div>
      </div>

      <div className="config-controls">
        <div className="input-group">
          <label htmlFor="loadSize">Load RS Size:</label>
          <input 
            type="number" 
            id="loadSize" 
            min="1"
            max="10"
            value={tempConfig.load}
            onChange={(e) => handleTempChange('load', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="storeSize">Store RS Size:</label>
          <input 
            type="number" 
            id="storeSize" 
            min="1"
            max="10"
            value={tempConfig.store}
            onChange={(e) => handleTempChange('store', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="addSize">Add RS Size:</label>
          <input 
            type="number" 
            id="addSize" 
            min="1"
            max="10"
            value={tempConfig.add}
            onChange={(e) => handleTempChange('add', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="multSize">Multiply RS Size:</label>
          <input 
            type="number" 
            id="multSize" 
            min="1"
            max="10"
            value={tempConfig.mult}
            onChange={(e) => handleTempChange('mult', e.target.value)}
          />
        </div>
      </div>

      <div className="config-controls">
        <button 
          className="apply-button" 
          onClick={() => handleConfigUpdate(tempConfig)}
        >
          Apply Changes
        </button>
      </div>

      <div className="file-upload">
        <input
          type="file"
          accept=".txt"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n');
                const newInstructions = [];
                lines.forEach(line => {
                  if (line.trim()) {
                    const parsed = parseInstruction(line.trim());
                    newInstructions.push(parsed);
                  }
                });
                setParsedInstructions(newInstructions);
              };
              reader.readAsText(file);
            }
          }}
        />
        <label>Upload Instructions File</label>
      </div>

      <div className="simulator-layout">
        {/* Top row */}
        <div className="top-row">
          <InstructionQueue />
          <Regfile />
        </div>
        
        {/* Bottom row */}
        <div className="reservation-stations">
          <div className="rs-row">
            <AddRS stationSize={stationSizes.add} />
            <MultRS stationSize={stationSizes.mult} />
          </div>
          <div className="memory-row">
            <Load stationSize={stationSizes.load} />
            <Store stationSize={stationSizes.store} />
          </div>
        </div>
      </div>

      <div style={{margin: '20px', textAlign: 'left'}}>
        <h3>Parsed Instructions:</h3>
        <pre>{JSON.stringify(parsedInstructions, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;