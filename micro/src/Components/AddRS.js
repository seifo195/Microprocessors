import React from "react";

const AddRS = ({ stationSize, stations }) => {
  return (
    <div style={{ margin: "20px" }}>
      <h2>Add Reservation Station</h2>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                <td>{station.tag || `Add${index + 1}`}</td>
                <td className={`status-${station.busy}`}>
                  {station.busy ? "Yes" : "No"}
                </td>
                <td>{station.operation || "-"}</td>
                <td>{station.Vi !== null ? station.Vi : "-"}</td>
                <td>{station.Vj !== null ? station.Vj : "-"}</td>
                <td>{station.Qi || "-"}</td>
                <td>{station.Qj || "-"}</td>
                <td>{station.time ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AddRS;

