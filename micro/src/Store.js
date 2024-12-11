import React from 'react'

function Store() {
    return (
      <div>
          <h1>Store</h1>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                  <tr>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Instruction</th>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Bussy</th>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
                      <th style={{ border: '1px solid black', padding: '8px' }}>V</th>
                      <th style={{ border: '1px solid black', padding: '8px' }}>Q</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td style={{ border: '1px solid black', padding: '8px' }}>Store</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>No</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>0x0000</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>0x0000</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>0</td>
                  </tr>
              </tbody>
          </table>
      </div>
    )
  }
  export default Store