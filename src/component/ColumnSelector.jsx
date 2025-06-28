import React from "react";

const ColumnSelector = ({ columns, onSelect }) => {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="my-10 p-2 border rounded"
    >
      <option value="">Select Column to Spell Check</option>
      {columns.map((col) => (
        <option key={col} value={col}>
          {col}
        </option>
      ))}
    </select>
  );
};

export default ColumnSelector;
