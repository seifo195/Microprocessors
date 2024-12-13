import React, { useState } from 'react'

function InstructionQeueu() {
    const [instructions, setInstructions] = useState([]);

    const options = [
        // Integer ALU operations
        'DADDI',
        'DSUBI',
        // Floating point operations
        'ADD.D',
        'ADD.S',
        'SUB.D',
        'SUB.S',
        'MUL.D',
        'MUL.S',
        'DIV.D',
        'DIV.S',
        // Memory operations
        'LW',
        'LD',
        'L.S',
        'L.D',
        'SW',
        'SD',
        'S.S',
        'S.D',
        // Branch operations
        'BNE',
        'BEQ'
      ];
      

    return (
        <div>
            <h1>Instruction Queue</h1>

            {/* New table for options and latency inputs */}
            <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Instruction</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Latency</th>
                    </tr>
                </thead>
                <tbody>
                    {options.map((opt, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{opt}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    defaultValue={1} 
                                    style={{ width: '60px' }} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Instruction</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Latency</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>destination</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>J</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>K</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Issue</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Execution</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Write Result</th>
                    </tr>
                </thead>
                <tbody>
                    {instructions.map((inst, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.instruction}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.latency}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.destination}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.j}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.k}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.issue}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.execution}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{inst.writeResult}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default InstructionQeueu