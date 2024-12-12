import './App.css';
import MultRS from './Components/MultRS.js';
import AddRS from './Components/AddRS.js';

function App() {
  return (
    <div className="App">
      <h1>Tomasulo Algorithm Simulator</h1>
      <AddRS stationSize={4}  />
      <MultRS stationSize={5} />
    </div>
  );
}

export default App;