import React, { useState, useEffect } from "react";
import "./Load.css";

const Load = ({ stationSize }) => {
  const createInitialStation = () => ({
    busy: false,
    instruction: "",
    address: null,
    V: null,
    Q: null,
  });

  const [stations, setStations] = useState(
    Array.from({ length: stationSize }, createInitialStation)
  );

  useEffect(() => {
    setStations(Array.from({ length: stationSize }, createInitialStation));
  }, [stationSize]);

  const updateStation = (index, updatedFields) => {
    setStations((prevStations) => {
      const updatedStations = [...prevStations];
      updatedStations[index] = { ...updatedStations[index], ...updatedFields };
      return updatedStations;
    });
  };

  const tableHeaders = ["#", "Busy", "Instruction", "Address", "V", "Q"];

  return (
    <div className="load-buffer-container">
      <h2 className="load-buffer-title">Load Buffer</h2>
      <table className="load-buffer-table">
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stations.map((station, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className={`status-${station.busy}`}>
                {station.busy ? "Yes" : "No"}
              </td>
              <td>{station.instruction || "-"}</td>
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

export default Load;