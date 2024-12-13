import React from 'react'

function Cache({ cache, cacheSize, blockSize }) {
  const numberOfRows = Math.floor(cacheSize / blockSize);

  // Helper function to format byte data
  const formatByte = (byte) => {
    if (byte === null) return '-';
    return `0x${byte.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="cache-display">
      <h3>Cache Contents</h3>
      <table style={{ 
        border: '1px solid black', 
        borderCollapse: 'collapse',
        margin: '10px',
        width: '100%',
        maxWidth: '800px'
      }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Block #</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Offset</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Data (Hex)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numberOfRows }).map((_, blockIndex) => (
            <tr key={blockIndex}>
              <td style={{ 
                border: '1px solid black', 
                padding: '8px',
                textAlign: 'center'
              }}>
                {blockIndex}
              </td>
              <td style={{ 
                border: '1px solid black', 
                padding: '8px'
              }}>
                {/* Display offset numbers */}
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {Array.from({ length: blockSize }).map((_, offset) => (
                    <span key={offset}>{offset}</span>
                  ))}
                </div>
              </td>
              <td style={{ 
                border: '1px solid black', 
                padding: '8px'
              }}>
                {/* Display actual cache data */}
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {cache?.[blockIndex]?.map((byte, index) => (
                    <span key={index} style={{ 
                      padding: '2px 4px',
                      backgroundColor: byte !== null ? '#e6f3ff' : '#f5f5f5'
                    }}>
                      {formatByte(byte)}
                    </span>
                  )) || Array(blockSize).fill('-')}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cache Statistics */}
      <div style={{ margin: '10px' }}>
        <h4>Cache Information:</h4>
        <p>Cache Size: {cacheSize} bytes</p>
        <p>Block Size: {blockSize} bytes</p>
        <p>Number of Blocks: {numberOfRows}</p>
      </div>
    </div>
  )
}

export default Cache