import React, { useState } from "react";

const generateMockSuggestions = (data) => {
  if (!Array.isArray(data)) return [];

  const suggestions = [];

  data.forEach((row, rowIndex) => {
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (value.includes("teh")) {
          suggestions.push({
            rowIndex,
            column: key,
            oldValue: value,
            newValue: value.replace(/teh/g, "the"),
          });
        }
       if (typeof value === "string") {
  if (key === "PriorityLevel") {
    const num = Number(value);
    if (isNaN(num) || num < 1 || num > 5) {
      suggestions.push({
        rowIndex,
        column: key,
        oldValue: value,
        newValue: "3",
      });
    }
  } else {
    if (value.includes("teh")) {
      suggestions.push({
        rowIndex,
        column: key,
        oldValue: value,
        newValue: value.replace(/teh/g, "the"),
      });
    }
    if (value && /^[a-z]/.test(value)) {
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
      if (capitalized !== value) {
        suggestions.push({
          rowIndex,
          column: key,
          oldValue: value,
          newValue: capitalized,
        });
      }
    }
  }
}

      }

      if (key === "PriorityLevel") {
        const num = Number(value);
        if (isNaN(num) || num < 1 || num > 5) {
          suggestions.push({
            rowIndex,
            column: key,
            oldValue: value,
            newValue: "3",
          });
        }
      }
    });
  });

  return suggestions;
};


const AISuggestions = ({ data, onApplySuggestions }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [applied, setApplied] = useState(false);

  const handleGenerate = () => {
    const generated = generateMockSuggestions(data);
    setSuggestions(generated);
    setApplied(false);
  };

  const handleApply = () => {
    if (!suggestions.length) return;

    const updatedData = [...data];
    suggestions.forEach(({ rowIndex, column, newValue }) => {
      if (updatedData[rowIndex] && column in updatedData[rowIndex]) {
        updatedData[rowIndex][column] = newValue;
      }
    });

    onApplySuggestions(updatedData);
    setApplied(true);
  };

  return (
    <div className="w-full max-w-5xl mt-6 p-4 bg-blue-50 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-blue-800">AI Suggestions</h2>
        <button
          onClick={handleGenerate}
          className="px-4 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Generate Suggestions
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="p-2 bg-white border border-blue-300 rounded"
            >
              Row <strong>{sug.rowIndex + 1}</strong>: Update{" "}
              <strong>{sug.column}</strong> from "
              <span className="text-red-500">{sug.oldValue}</span>" to "
              <span className="text-green-600">{sug.newValue}</span>"
            </div>
          ))}

          <button
            onClick={handleApply}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply All Suggestions
          </button>

          {applied && (
            <p className="text-sm text-green-700 mt-2">Changes applied!</p>
          )}
        </div>
      )}

      {suggestions.length === 0 && (
        <p className="text-gray-600">No suggestions yet. Click "Generate Suggestions".</p>
      )}
    </div>
  );
};

export default AISuggestions;
