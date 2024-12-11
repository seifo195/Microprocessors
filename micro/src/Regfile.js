import React from 'react'

function Regfile() {
  return (
    <div>
        <h3>Register File</h3>
        <table style={{ borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Register</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R0</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R1</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R2</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R3</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R4</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R5</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R6</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R7</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R8</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
                <tr><td style={{ border: '1px solid black', padding: '8px' }}>R9</td><td style={{ border: '1px solid black', padding: '8px' }}>0000</td></tr>
            </tbody>
        </table>
    </div>
  )
}

export default Regfile