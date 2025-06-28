import React, { useState } from "react";

const CoRunRule = ({ onAddRule }) => {
  const [taskIds, setTaskIds] = useState("");

  const handleAdd = () => {
    const tasks = taskIds.split(",").map(t => t.trim()).filter(Boolean);
    if (tasks.length >= 2) {
      onAddRule({ type: "coRun", tasks });
      setTaskIds("");
    } else {
      alert("Please enter at least two TaskIDs");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Co-Run Rule</h3>
      <input
        type="text"
        placeholder="Enter TaskIDs (comma separated)"
        value={taskIds}
        onChange={e => setTaskIds(e.target.value)}
        className="border px-2 py-1 w-full mb-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Co-Run Rule
      </button>
    </div>
  );
};

export default CoRunRule;
