import React from 'react'

function Regfile({ registers }) {
  const { integer = {}, floating = {} } = registers || {};

  return (
    <div>
      <h3>Register File</h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Int Reg</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 32 }).map((_, i) => (
              <tr key={`R${i}`}>
                <td style={{ border: '1px solid black', padding: '8px' }}>R{i}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {integer[i]?.toString(16).padStart(8, '0') || '00000000'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>FP Reg</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 32 }).map((_, i) => (
              <tr key={`F${i}`}>
                <td style={{ border: '1px solid black', padding: '8px' }}>F{i}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {floating[i]?.toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Regfile