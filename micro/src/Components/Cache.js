import React from 'react'

function Cache({ cacheSize, blockSize }) {
  const numberOfRows = Math.floor(cacheSize / blockSize);

  return (
    <div>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Cache Size</th>
            <th style={{ border: '1px solid black' }}>Block number</th>
            <th style={{ border: '1px solid black' }}>Data</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numberOfRows }).map((_, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black' }}></td>
              <td style={{ border: '1px solid black' }}></td>
              <td style={{ border: '1px solid black' }}> data</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Cache