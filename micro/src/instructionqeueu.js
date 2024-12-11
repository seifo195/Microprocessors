import React from 'react'

function instructionqeueu() {
  return (
    <div>instructionqeueu
        <h1>Instruction Queue</h1>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Instruction</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>destination</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>J</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>K</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Issue</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Execution</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Write Result</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ border: '1px solid black', padding: '8px' }}>Load</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>0x0000</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>0</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>0</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>0</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>0</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>0</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default instructionqeueu