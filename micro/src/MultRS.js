import React, { useState } from "react";

const MultRS = ({ title, stationSize }) => {
  const [stations, setStations] = useState(
    Array.from({ length: stationSize }, () => ({
      busy: false,
      instruction: "",
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
      result: null,
    }))
  );

  const handleInputChange = (index, field, value) => {
    const updatedStations = [...stations];
    updatedStations[index][field] = value;
    setStations(updatedStations);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>{title}</h2>
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
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="checkbox"
                  checked={station.busy}
                  onChange={(e) =>
                    handleInputChange(index, "busy", e.target.checked)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={station.instruction}
                  onChange={(e) =>
                    handleInputChange(index, "instruction", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={station.Vj}
                  onChange={(e) =>
                    handleInputChange(index, "Vj", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={station.Vk}
                  onChange={(e) =>
                    handleInputChange(index, "Vk", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={station.Qj}
                  onChange={(e) =>
                    handleInputChange(index, "Qj", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={station.Qk}
                  onChange={(e) =>
                    handleInputChange(index, "Qk", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={station.result}
                  onChange={(e) =>
                    handleInputChange(index, "result", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MultRS;
