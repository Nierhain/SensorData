import React from 'react';

interface TableRow {
  column1: string;
  column2: string;
  column3: string;
}

const Table: React.FC = () => {
  // Generate random data for the table
  const tableData: TableRow[] = [
    { column1: 'Value 1-1', column2: 'Value 1-2', column3: 'Value 1-3' },
    { column1: 'Value 2-1', column2: 'Value 2-2', column3: 'Value 2-3' },
    { column1: 'Value 3-1', column2: 'Value 3-2', column3: 'Value 3-3' },
    { column1: 'Value 4-1', column2: 'Value 4-2', column3: 'Value 4-3' },
    { column1: 'Value 5-1', column2: 'Value 5-2', column3: 'Value 5-3' },
  ];

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Name</th>
            <th>Wert</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              <td>{row.column3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
