
import React, { useState } from "react";

const LoadLimitRule = ({ onAddRule }) => {
  const [workerGroup, setWorkerGroup] = useState("");
  const [maxSlotsPerPhase, setMaxSlotsPerPhase] = useState("");

  const handleAdd = () => {
    if (workerGroup && maxSlotsPerPhase) {
      onAddRule({
        type: "loadLimit",
        workerGroup,
        maxSlotsPerPhase: Number(maxSlotsPerPhase),
      });
      setWorkerGroup("");
      setMaxSlotsPerPhase("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Load Limit Rule</h3>
      <input
        type="text"
        placeholder="Worker Group"
        value={workerGroup}
        onChange={e => setWorkerGroup(e.target.value)}
        className="border px-2 py-1 mb-2 mr-2"
      />
      <input
        type="number"
        placeholder="Max Slots Per Phase"
        value={maxSlotsPerPhase}
        onChange={e => setMaxSlotsPerPhase(e.target.value)}
        className="border px-2 py-1 mb-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Load Limit Rule
      </button>
    </div>
  );
};

export default LoadLimitRule;
