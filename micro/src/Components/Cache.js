import React from 'react'

function Cache({ cache, cacheSize, blockSize }) {
  if (!cache) return null;

  return (
    <div className="cache-display">
      <h3>Cache Contents</h3>
      <table style={{ 
        border: '1px solid black', 
        borderCollapse: 'collapse',
        margin: '10px',
        width: '100%'
      }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Block #</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Valid</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Tag</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Data</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cacheSize / blockSize }).map((_, blockIndex) => {
            const block = cache.Cache?.[blockIndex] || {};
            return (
              <tr key={blockIndex}>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {blockIndex}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {block.valid ? '✓' : '-'}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {block.tag ?? '-'}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {Array.isArray(block) 
                    ? block.map((byte, i) => 
                        <span key={i} style={{marginRight: '4px'}}>
                          {byte?.toString(16).padStart(2, '0') || '00'}
                        </span>)
                    : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ margin: '10px' }}>
        <h4>Cache Statistics:</h4>
        <p>Hits: {cache.hits || 0}</p>
        <p>Misses: {cache.misses || 0}</p>
        <p>Hit Rate: {cache.hits && cache.accessCount 
          ? ((cache.hits / cache.accessCount) * 100).toFixed(2) 
          : 0}%</p>
      </div>
    </div>
  )
}

export default Cache