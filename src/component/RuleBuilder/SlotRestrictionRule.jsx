import React, { useState } from "react";

const SlotRestrictionRule = ({ onAddRule }) => {
  const [groupType, setGroupType] = useState("ClientGroup");
  const [groupName, setGroupName] = useState("");
  const [minCommonSlots, setMinCommonSlots] = useState("");

  const handleAdd = () => {
    if (groupName && minCommonSlots) {
      onAddRule({
        type: "slotRestriction",
        groupType,
        groupName,
        minCommonSlots: Number(minCommonSlots),
      });
      setGroupName("");
      setMinCommonSlots("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold text-lg mb-2">Slot Restriction Rule</h3>
      <select
        value={groupType}
        onChange={e => setGroupType(e.target.value)}
        className="border px-2 py-1 mb-2"
      >
        <option value="ClientGroup">ClientGroup</option>
        <option value="WorkerGroup">WorkerGroup</option>
      </select>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={e => setGroupName(e.target.value)}
        className="border px-2 py-1 mb-2 ml-2"
      />
      <input
        type="number"
        placeholder="Min Common Slots"
        value={minCommonSlots}
        onChange={e => setMinCommonSlots(e.target.value)}
        className="border px-2 py-1 mb-2 ml-2"
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
        Add Slot Restriction Rule
      </button>
    </div>
  );
};

export default SlotRestrictionRule;
