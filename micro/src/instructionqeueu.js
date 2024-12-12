import React, { useState } from 'react'

function InstructionQeueu() {
    const [instructions, setInstructions] = useState([]);
    const [currentInstruction, setCurrentInstruction] = useState('');
    const [currentLatency, setCurrentLatency] = useState(1);

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
      

    // Add latency options
    const latencyOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Handle adding new instruction
    const handleAddInstruction = () => {
        if (currentInstruction) {
            setInstructions([...instructions, {
                instruction: currentInstruction,
                destination: '0x0000',
                j: 0,
                k: 0,
                issue: 0,
                execution: 0,
                writeResult: 0,
                latency: currentLatency
            }]);
            setCurrentInstruction(''); // Reset selection
            setCurrentLatency(1); // Reset latency to default
        }
    };

    return (
        <div>
            <h1>Instruction Queue</h1>
            
            {/* Add instruction controls */}
            <div style={{ marginBottom: '20px' }}>
                <select 
                    value={currentInstruction}
                    onChange={(e) => setCurrentInstruction(e.target.value)}
                    style={{ marginRight: '10px' }}
                >
                    <option value="">Select Instruction</option>
                    {options.map((opt, index) => (
                        <option key={index} value={opt}>{opt}</option>
                    ))}
                </select>
                
                <select
                    value={currentLatency}
                    onChange={(e) => setCurrentLatency(Number(e.target.value))}
                    style={{ marginRight: '10px' }}
                >
                    {latencyOptions.map((lat) => (
                        <option key={lat} value={lat}>Latency: {lat}</option>
                    ))}
                </select>
                
                <button onClick={handleAddInstruction}>Add Instruction</button>
            </div>

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