import React, { useState, useEffect } from "react";
import "./MultRS.css";

const MultRS = ({ stationSize }) => {
  const [stations, setStations] = useState(
    Array.from({ length: stationSize }, () => ({
      busy: false,
      instruction: "",
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
      address: null,
    }))
  );

  useEffect(() => {
    setStations(
      Array.from({ length: stationSize }, () => ({
        busy: false,
        instruction: "",
        Vj: null,
        Vk: null,
        Qj: null,
        Qk: null,
        address: null,
      }))
    );
  }, [stationSize]);

  // Function to update a specific station programmatically
  const updateStation = (index, updatedFields) => {
    setStations((prevStations) => {
      const updatedStations = [...prevStations];
      updatedStations[index] = { ...updatedStations[index], ...updatedFields };
      return updatedStations;
    });
  };
  
  const handleChange = () => {
    updateStation(1, {
      busy: true,
      instruction: "MUL.D F0, F2, F4",
      Vj: 3,
      Vk: 4,
      Qj: "Add1",
      Qk: "Add2",
      Address: 0x200
    });
  }
  

  return (
    <div className="mult-rs">
      <div className="rs-title">
        <h2>Multiply Reservation Station</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Busy</th>
              <th>Instruction</th>
              <th>Vj</th>
              <th>Vk</th>
              <th>Qj</th>
              <th>Qk</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{station.busy ? "Yes" : "No"}</td>
                <td>{station.instruction}</td>
                <td>{station.Vj ?? "-"}</td>
                <td>{station.Vk ?? "-"}</td>
                <td>{station.Qj ?? "-"}</td>
                <td>{station.Qk ?? "-"}</td>
                <td>{station.Address ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultRS;
