import './App.css';
import MultRS from './MultRS.js';
import AddRS from './AddRS.js';
import Regfile from './Regfile.js';
import InstructionQueue from './instructionqeueu.js';
import Load from './Load.js';
import Store from './Store.js'; 
function App() {
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
      <select name="" id="">{options.map((option) => <option value={option}>{option}</option>)}</select>
      
      <div className="simulator-layout">
        {/* Top row */}
        <div className="top-row">
          <InstructionQueue />
          <Regfile />
        </div>
        
        {/* Bottom row */}
        <div className="reservation-stations">
          <div className="rs-row">
            <AddRS stationSize={4} />
            <MultRS stationSize={5} />
          </div>
          <div className="memory-row">
            <Load />
            <Store />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
