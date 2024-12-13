import React from 'react';
import './InstructionQueue.css';

function InstructionQueue({ instructions }) {
  return (
    <div className="instruction-queue">
      <h2>Instruction Queue</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Instruction</th>
              <th>Issue</th>
              <th>Execute Start</th>
              <th>Execute End</th>
              <th>Write Result</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((inst, index) => (
              <tr key={index}>
                <td>
                  {`${inst.type} ${inst.dest || ''} ${inst.src1 || ''} ${inst.src2 || ''}`}
                </td>
                <td>{inst.issueCycle || '-'}</td>
                <td>{inst.executeStartCycle || '-'}</td>
                <td>{inst.executeEndCycle || '-'}</td>
                <td>{inst.writeResultCycle || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstructionQueue;