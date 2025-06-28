import React from "react";

const MissingColumnsWarning = ({ missingColumns }) => {
  if (!missingColumns.length) return null;

  return (
    <p className="font-medium text-zinc-700">
      <span className="font-bold text-zinc-900">Missing Columns:</span>{" "}
      {missingColumns.map(({ columnName, index }, idx) => (
        <span key={columnName}>
          {columnName} (idx: {index})
          {idx !== missingColumns.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
};

export default MissingColumnsWarning;
