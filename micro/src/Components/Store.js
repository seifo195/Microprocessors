import React from "react";

const Store = ({ stationSize, stations }) => {
  return (
    <div style={{ margin: "20px" }}>
      <h2>Store Buffer</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Busy</th>
            <th>Op</th>
            <th>Address</th>
            <th>V</th>
            <th>Q</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: stationSize }).map((_, index) => {
            const station = stations[index] || {};
            return (
              <tr key={index}>
                <td>{station.tag || `Store${index + 1}`}</td>
                <td className={`status-${station.busy}`}>
                  {station.busy ? "Yes" : "No"}
                </td>
                <td>{station.op || "-"}</td>
                <td>{station.address !== null ? station.address : "-"}</td>
                <td>{station.Vi !== null ? station.Vi : "-"}</td>
                <td>{station.Qi || "-"}</td>
                <td>{station.time ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Store;