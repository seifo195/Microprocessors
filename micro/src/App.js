import './App.css';
import MultRS from './MultRS.js';
import AddRS from './AddRS.js';
import Regfile from './Regfile.js';
import InstructionQueue from './instructionqeueu.js';
import Load from './Load.js';
import Store from './Store.js'; 
import { useState } from 'react';

function App() {
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
        <button className="apply-button" onClick={handleApplyChanges}>
          Apply Changes
        </button>
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
    </div>
  );
}

export default App;