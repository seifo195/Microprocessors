import React, { useState, useEffect } from "react";

const AddRS = ({ stationSize }) => {
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

  const updateStation = (index, updatedFields) => {
    setStations((prevStations) => {
      const updatedStations = [...prevStations];
      updatedStations[index] = { ...updatedStations[index], ...updatedFields };
      return updatedStations;
    });
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Add Reservation Station</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
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
  );
};

export default AddRS;

