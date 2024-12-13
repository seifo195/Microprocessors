import React from "react";
import "./Load.css";

const Load = ({ stationSize, stations }) => {
  return (
    <div className="load-buffer-container">
      <h2 className="load-buffer-title">Load Buffer</h2>
      <table className="load-buffer-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Busy</th>
            <th>Op</th>
            <th>Address</th>
            <th>Time</th>
            <th>Q</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: stationSize }).map((_, index) => {
            const station = stations[index] || {};
            return (
              <tr key={index}>
                <td>{station.tag || `Load${index + 1}`}</td>
                <td className={`status-${station.busy}`}>
                  {station.busy ? "Yes" : "No"}
                </td>
                <td>{station.op || "-"}</td>
                <td>{station.address !== null ? station.address : "-"}</td>
                <td>{station.time ?? "-"}</td>
                <td>{station.Qi || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Load;