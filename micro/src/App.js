import './App.css';
import MultRS from './MultRS.js';
function App() {
  return (
    <div className="App">
      <h1>Tomasulo Algorithm Simulator</h1>
      <MultRS title="Add Reservation Station" stationSize={3} />
      <MultRS title="Multiply Reservation Station" stationSize={5} />
    </div>
  );
}

export default App;
