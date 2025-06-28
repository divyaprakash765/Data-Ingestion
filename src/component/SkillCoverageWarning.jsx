import React from "react";

const SkillCoverageWarning = ({ missingSkills }) => {
  if (!missingSkills.size) return null;

  return (
    <div className="my-4 p-4 bg-red-200 text-red-800 rounded max-w-5xl w-full">
      <strong>Missing Worker Skills:</strong> {Array.from(missingSkills).join(", ")}
    </div>
  );
};

export default SkillCoverageWarning;
