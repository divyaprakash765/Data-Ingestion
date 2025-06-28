import CoRunRule from "../component/RuleBuilder/CoRunRule";
import SlotRestrictionRule from "../component/RuleBuilder/SlotRestrictionRule";
import LoadLimitRule from "../component/RuleBuilder/LoadLimitRule";
import PhaseWindowRule from "../component/RuleBuilder/PhaseWindowRule";
import PatternMatchRule from "../component/RuleBuilder/PatternMatchRule";
import PrecedenceOverrideRule from "../component/RuleBuilder/PrecedenceOverrideRule";
import RuleSummary from "../component/RuleBuilder/RuleSummary";
import { downloadRulesJSON } from "../utils/ruleUtils";
import { useState } from "react";

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
