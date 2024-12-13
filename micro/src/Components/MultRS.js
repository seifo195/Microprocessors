import React from "react";
import "./MultRS.css";

const MultRS = ({ stationSize, stations }) => {
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
              <th>Op</th>
              <th>Vj</th>
              <th>Vk</th>
              <th>Qj</th>
              <th>Qk</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: stationSize }).map((_, index) => {
              const station = stations[index] || {};
              return (
                <tr key={index}>
                  <td>{station.tag || `Mult${index + 1}`}</td>
                  <td>{station.busy ? "Yes" : "No"}</td>
                  <td>{station.operation || "-"}</td>
                  <td>{station.Vi ?? "-"}</td>
                  <td>{station.Vj ?? "-"}</td>
                  <td>{station.Qi ?? "-"}</td>
                  <td>{station.Qj ?? "-"}</td>
                  <td>{station.time ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultRS;
