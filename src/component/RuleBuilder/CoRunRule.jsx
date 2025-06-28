import React, { useState } from "react";

const CoRunRule = ({ onAddRule }) => {
  const [selectedTasks, setSelectedTasks] = useState("");

  const handleAdd = () => {
    const tasks = selectedTasks.split(",").map(t => t.trim()).filter(Boolean);
    if (tasks.length >= 2) {
      onAddRule({
        type: "coRun",
        tasks,
      });
      setSelectedTasks("");
    } else {
      alert("Select at least two TaskIDs");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Co-Run Rule</h3>
      <input
        type="text"
        placeholder="Enter TaskIDs (comma separated)"
        value={selectedTasks}
        onChange={e => setSelectedTasks(e.target.value)}
        className="border px-2 py-1 w-full mb-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Co-Run Rule
      </button>
    </div>
  );
};

export default CoRunRule;
