import React from "react";

const RuleSummary = ({ rules, onExport }) => {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-3">Rule Summary</h3>
      {rules.length === 0 ? (
        <p className="text-gray-500">No rules added yet.</p>
      ) : (
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-60">
          {JSON.stringify(rules, null, 2)}
        </pre>
      )}
      <button
        onClick={onExport}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Download Rules JSON
      </button>
    </div>
  );
};

export default RuleSummary;
