import React, { useState } from "react";
import CoRunRule from "../component/RuleBuilder/CoRunRule";
import SlotRestrictionRule from "../component/RuleBuilder/CoRunRule";
import LoadLimitRule from "../component/RuleBuilder/CoRunRule";
import PhaseWindowRule from "../component/RuleBuilder/CoRunRule";
import PatternMatchRule from "../component/RuleBuilder/CoRunRule";
import PrecedenceOverrideRule from "../component/RuleBuilder/CoRunRule";
import RuleSummary from "../component/RuleBuilder/CoRunRule";
import { downloadRulesJSON } from "../utils/ruleUtils";

const RuleEditor = () => {
  const [rules, setRules] = useState([]);

  const addRule = (rule) => {
    setRules((prev) => [...prev, rule]);
  };

  const exportRules = () => {
    downloadRulesJSON(rules);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🧩 Rule Builder</h1>

      <CoRunRule onAddRule={addRule} />
      <SlotRestrictionRule onAddRule={addRule} />
      <LoadLimitRule onAddRule={addRule} />
      <PhaseWindowRule onAddRule={addRule} />
      <PatternMatchRule onAddRule={addRule} />
      <PrecedenceOverrideRule onAddRule={addRule} />
      <RuleSummary rules={rules} onExport={exportRules} />
    </div>
  );
};

export default RuleEditor;
