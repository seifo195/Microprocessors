import React, { useState, useEffect } from "react";

const Store = ({ stationSize }) => {
  const [stations, setStations] = useState(
    Array.from({ length: stationSize }, () => ({
      busy: false,
      instruction: "",
      address: null,
      V: null,
      Q: null,
    }))
  );

  useEffect(() => {
    setStations(
      Array.from({ length: stationSize }, () => ({
        busy: false,
        instruction: "",
        address: null,
        V: null,
        Q: null,
      }))
    );
  }, [stationSize]);

  const updateStation = (index, updatedFields) => {
    setStations((prevStations) => {
      const updatedStations = [...prevStations];
      updatedStations[index] = { ...updatedStations[index], ...updatedFields };
      return updatedStations;
    });
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Store Buffer</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Busy</th>
            <th>Instruction</th>
            <th>Address</th>
            <th>V</th>
            <th>Q</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{station.busy ? "Yes" : "No"}</td>
              <td>{station.instruction}</td>
              <td>{station.address ?? "-"}</td>
              <td>{station.V ?? "-"}</td>
              <td>{station.Q ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Store;