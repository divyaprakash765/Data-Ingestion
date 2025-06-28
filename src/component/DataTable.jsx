import React from "react";

const DataTable = ({
  columns,
  data,
  idColumn,
  duplicateIDs,
  invalidJsonRows,
  numericErrors,
  invalidReferences,
  circularGroups,
  phaseConflicts,
  maxConcurrencyErrors,
  workerOverloads,
  onCellEdit,
}) => {
  return (
    <div className="overflow-x-auto w-full max-w-5xl mt-6">
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th key={index} className="border px-4 py-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-100 ${
                workerOverloads.has(row[idColumn]) ? "bg-yellow-100" : ""
              }`}
            >
              {columns.map((col, colIndex) => {
                const isDuplicateID = col === idColumn && duplicateIDs.has(row[col]);
                const isInvalidJSON = col === "AttributesJSON" && invalidJsonRows.has(rowIndex);
                const isNumericError = numericErrors.has(`${rowIndex}-${col}`);
                const isInvalidRef = col === "RequestedTaskIDs" && invalidReferences.has(rowIndex);
                const isCircularGroup = col === idColumn && circularGroups.has(row[col]);
                const isPhaseConflict = phaseConflicts.has(rowIndex);
                const isMaxConcurrencyError = maxConcurrencyErrors.has(rowIndex);

                return (
                  <td key={colIndex} className="border px-4 py-2">
                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) => onCellEdit(rowIndex, col, e.target.value)}
                      className={`w-full bg-transparent outline-none
                        ${
                          isDuplicateID
                            ? "border-2 border-red-600 bg-red-100"
                            : ""
                        }
                        ${
                          isInvalidJSON
                            ? "border-2 border-red-600 bg-red-100"
                            : ""
                        }
                        ${
                          isNumericError
                            ? "border-2 border-orange-600 bg-orange-100"
                            : ""
                        }
                        ${
                          isInvalidRef
                            ? "border-2 border-red-800 bg-red-200"
                            : ""
                        }
                        ${
                          isCircularGroup
                            ? "border-2 border-purple-600 bg-purple-100"
                            : ""
                        }
                        ${
                          isPhaseConflict
                            ? "border-2 border-yellow-600 bg-yellow-100"
                            : ""
                        }
                        ${
                          isMaxConcurrencyError
                            ? "border-2 border-pink-600 bg-pink-100"
                            : ""
                        }
                        `}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
