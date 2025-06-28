import React, { useState } from "react";

const PrecedenceOverrideRule = ({ onAddRule }) => {
  const [globalRules, setGlobalRules] = useState("");
  const [specificRules, setSpecificRules] = useState("");

  const handleAdd = () => {
    const global = globalRules.split(",").map(r => r.trim()).filter(Boolean);
    const specific = specificRules.split(",").map(r => r.trim()).filter(Boolean);
    if (global.length && specific.length) {
      onAddRule({
        type: "precedenceOverride",
        globalRules: global,
        specificRules: specific,
      });
      setGlobalRules("");
      setSpecificRules("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Precedence Override Rule</h3>
      <input
        type="text"
        placeholder="Global Rule Types (comma separated)"
        value={globalRules}
        onChange={e => setGlobalRules(e.target.value)}
        className="border px-2 py-1 mb-2 mr-2"
      />
      <input
        type="text"
        placeholder="Specific Rule Types (comma separated)"
        value={specificRules}
        onChange={e => setSpecificRules(e.target.value)}
        className="border px-2 py-1 mb-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Precedence Override Rule
      </button>
    </div>
  );
};

export default PrecedenceOverrideRule;
