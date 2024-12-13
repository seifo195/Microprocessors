import React from 'react';

function InstructionQueue({ instructions, latencies }) {
  return (
    <div>
      <h2>Instruction Queue</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Instruction</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Issue</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Execute</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Write Result</th>
          </tr>
        </thead>
        <tbody>
          {instructions.map((inst, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {`${inst.type} ${inst.dest || ''} ${inst.src1 || ''} ${inst.src2 || ''}`}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {inst.status || 'Waiting'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {inst.issueTime || '-'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {inst.executeTime || '-'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {inst.writeTime || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstructionQueue;