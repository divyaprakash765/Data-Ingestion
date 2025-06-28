import React, { useState } from "react";

const PatternMatchRule = ({ onAddRule }) => {
  const [regex, setRegex] = useState("");
  const [template, setTemplate] = useState("");
  const [params, setParams] = useState("");

  const handleAdd = () => {
    if (regex && template) {
      onAddRule({
        type: "patternMatch",
        regex,
        template,
        params: params ? params.split(",").map(p => p.trim()) : [],
      });
      setRegex("");
      setTemplate("");
      setParams("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Pattern Match Rule</h3>
      <input
        type="text"
        placeholder="Regex"
        value={regex}
        onChange={e => setRegex(e.target.value)}
        className="border px-2 py-1 mb-2 mr-2"
      />
      <input
        type="text"
        placeholder="Rule Template"
        value={template}
        onChange={e => setTemplate(e.target.value)}
        className="border px-2 py-1 mb-2"
      />
      <input
        type="text"
        placeholder="Parameters (comma separated)"
        value={params}
        onChange={e => setParams(e.target.value)}
        className="border px-2 py-1 mb-2 mt-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Pattern Match Rule
      </button>
    </div>
  );
};

export default PatternMatchRule;
