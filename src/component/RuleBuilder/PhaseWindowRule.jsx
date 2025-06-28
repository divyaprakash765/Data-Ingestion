import React, { useState } from "react";

const PhaseWindowRule = ({ onAddRule }) => {
  const [taskId, setTaskId] = useState("");
  const [phases, setPhases] = useState("");

  const handleAdd = () => {
    const allowedPhases = phases.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    if (taskId && allowedPhases.length) {
      onAddRule({
        type: "phaseWindow",
        taskId,
        allowedPhases,
      });
      setTaskId("");
      setPhases("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Phase Window Rule</h3>
      <input
        type="text"
        placeholder="Task ID"
        value={taskId}
        onChange={e => setTaskId(e.target.value)}
        className="border px-2 py-1 mb-2 mr-2"
      />
      <input
        type="text"
        placeholder="Allowed Phases (comma separated)"
        value={phases}
        onChange={e => setPhases(e.target.value)}
        className="border px-2 py-1 mb-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Phase Window Rule
      </button>
    </div>
  );
};

export default PhaseWindowRule;
