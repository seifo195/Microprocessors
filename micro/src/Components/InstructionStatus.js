import React from 'react';

function InstructionStatus({ instructions }) {
    console.log('Instructions in status component:', instructions);

    const formatInstruction = (inst) => {
        if (!inst) return '';
        let str = inst.type || '';
        
        if (inst.dest) {
            str += ` ${inst.dest}`;
        }
        
        if (inst.src1) {
            str += `, ${inst.src1}`;
        }
        
        if (inst.src2) {
            str += `, ${inst.src2}`;
        } else if (inst.address !== undefined) {
            str += `, ${inst.address}`;
        }
        
        return str;
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Instruction Status Table</h2>
            <table style={{ 
                borderCollapse: 'collapse', 
                width: '100%', 
                marginBottom: '20px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f5f5f5' }}>Instruction</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f5f5f5' }}>Issue</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f5f5f5' }}>Execute Start</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f5f5f5' }}>Execute End</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: '#f5f5f5' }}>Write Result</th>
                    </tr>
                </thead>
                <tbody>
                    {instructions.map((inst, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>
                                {formatInstruction(inst)}
                            </td>
                            <td style={{ 
                                border: '1px solid #ddd', 
                                padding: '12px', 
                                textAlign: 'center',
                                backgroundColor: inst.issueTime ? '#f0f9ff' : 'white'
                            }}>
                                {inst.issueTime || '-'}
                            </td>
                            <td style={{ 
                                border: '1px solid #ddd', 
                                padding: '12px', 
                                textAlign: 'center',
                                backgroundColor: inst.executeStartTime ? '#f0fff0' : 'white'
                            }}>
                                {inst.executeStartTime || '-'}
                            </td>
                            <td style={{ 
                                border: '1px solid #ddd', 
                                padding: '12px', 
                                textAlign: 'center',
                                backgroundColor: inst.executeEndTime ? '#fff0f0' : 'white'
                            }}>
                                {inst.executeEndTime || '-'}
                            </td>
                            <td style={{ 
                                border: '1px solid #ddd', 
                                padding: '12px', 
                                textAlign: 'center',
                                backgroundColor: inst.writeTime ? '#f0f0ff' : 'white'
                            }}>
                                {inst.writeTime || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InstructionStatus; 