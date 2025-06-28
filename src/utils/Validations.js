// Utility: find duplicates in an array, returns Set of duplicated values
export function findDuplicates(arr) {
  const counts = {};
  const duplicates = new Set();
  arr.forEach((item) => {
    if (item === undefined || item === null || item === "") return;
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > 1) duplicates.add(item);
  });
  return duplicates;
}

export function getMissingColumnsWithIndex(requiredColumns, actualColumns) {
  const missing = [];
  requiredColumns.forEach((col, index) => {
    if (!actualColumns.includes(col)) {
      missing.push({ columnName: col, index });
    }
  });
  return missing;
}

// Utility: Validate AvailableSlots format (must be array of numbers or empty)
function validateAvailableSlots(value) {
  if (!value) return true;
  try {
    let arr = Array.isArray(value) ? value : JSON.parse(value);
    if (!Array.isArray(arr)) return false;
    return arr.every((v) => !isNaN(Number(v)));
  } catch {
    return false;
  }
}

// Utility: Detect cycles in co-run groups graph using DFS
function detectCycle(graph) {
  const visited = new Set();
  const recStack = new Set();

  function dfs(node) {
    if (!graph.has(node)) return false;
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (const neighbor of graph.get(node)) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  }

  for (const node of graph.keys()) {
    if (dfs(node)) return true;
  }
  return false;
}

/**
 * Main validation function for your core checks.
 *
 * @param {Array} data 
 * @param {string} fileName
 * @param {Object} setters 
 * @param {Array} columns 
 */
export function runValidations(data, fileName, setters, columns = []) {
  if (!data || !data.length) {
    Object.values(setters).forEach((set) => set(new Set()));
    return;
  }

  const missingColumns = [];
  const duplicateIDs = new Set();
  const invalidJsonRows = new Set();
  const numericErrors = new Set();
  const invalidReferences = new Set();
  const circularGroups = new Set();
  const phaseConflicts = new Set();
  const workerOverloads = new Set();
  const phaseSaturationErrors = new Set();
  const skillCoverageErrors = new Set();
  const maxConcurrencyErrors = new Set();

  const requiredColsMap = {
    "client.csv": ["ClientID", "ClientName", "AvailableSlots", "AttributesJSON"],
    "worker.csv": ["WorkerID", "WorkerName", "Skills", "AvailableSlots", "MaxLoadPerPhase"],
    "task.csv": [
      "TaskID",
      "RequestedTaskIDs",
      "PriorityLevel",
      "Duration",
      "AttributesJSON",
      "CoRunGroup",
      "Phase",
      "RequiredSkill",
      "MaxConcurrent",
    ],
  };

  const requiredCols = requiredColsMap[fileName] || [];

  requiredCols.forEach((col, index) => {
    if (!Array.isArray(columns) || !columns.includes(col)) {
      missingColumns.push({ columnName: col, index });
    }
  });

  setters.setMissingColumns(missingColumns);

  const idColMap = {
    "client.csv": "ClientID",
    "worker.csv": "WorkerID",
    "task.csv": "TaskID",
  };
  const idColumn = idColMap[fileName];

  if (idColumn) {
    const ids = data.map((row) => row[idColumn]);
    const dups = findDuplicates(ids);
    setters.setDuplicateIDs(dups);
  }

  // Malformed AvailableSlots
  if (columns.includes("AvailableSlots")) {
    data.forEach((row, idx) => {
      if (!validateAvailableSlots(row["AvailableSlots"])) {
        numericErrors.add(`${idx}-AvailableSlots`);
      }
    });
  }

  // PriorityLevel and Duration range checks
  data.forEach((row, idx) => {
    if ("PriorityLevel" in row) {
      const val = Number(row.PriorityLevel);
      if (isNaN(val) || val < 1 || val > 5) numericErrors.add(`${idx}-PriorityLevel`);
    }
    if ("Duration" in row) {
      const val = Number(row.Duration);
      if (isNaN(val) || val < 1) numericErrors.add(`${idx}-Duration`);
    }
  });

  // Broken JSON in AttributesJSON
  if (columns.includes("AttributesJSON")) {
    data.forEach((row, idx) => {
      if (row.AttributesJSON) {
        try {
          JSON.parse(row.AttributesJSON);
        } catch {
          invalidJsonRows.add(idx);
        }
      }
    });
  }

  // Unknown references
  if (fileName === "task.csv" && columns.includes("RequestedTaskIDs")) {
    const allTaskIDs = new Set(data.map((row) => row.TaskID));
    data.forEach((row, idx) => {
      if (row.RequestedTaskIDs) {
        const refs = row.RequestedTaskIDs.split(",").map((x) => x.trim());
        refs.forEach((ref) => {
          if (ref && !allTaskIDs.has(ref)) {
            invalidReferences.add(idx);
          }
        });
      }
    });
  }

  // Detect circular groups
  if (fileName === "task.csv" && columns.includes("CoRunGroup")) {
    const graph = new Map();
    data.forEach((row) => {
      const taskId = row.TaskID;
      if (!taskId) return;
      const coRuns = row.CoRunGroup ? row.CoRunGroup.split(",").map((x) => x.trim()) : [];
      graph.set(taskId, coRuns.filter(Boolean));
    });

    if (detectCycle(graph)) {
      data.forEach((row) => {
        circularGroups.add(row.TaskID);
      });
    }
  }

  // Phase range (e.g., Phase should be 1-4)
  if (fileName === "task.csv" && columns.includes("Phase")) {
    data.forEach((row, idx) => {
      const phase = Number(row.Phase);
      if (isNaN(phase) || phase < 1 || phase > 4) {
        phaseConflicts.add(idx);
      }
    });
  }

  // Worker overload: AvailableSlots.length > MaxLoadPerPhase
  if (fileName === "worker.csv") {
    data.forEach((row) => {
      let slotsCount = 0;
      try {
        const parsed = JSON.parse(row.AvailableSlots);
        if (Array.isArray(parsed)) {
          slotsCount = parsed.length;
        }
      } catch {}
      const maxLoad = Number(row.MaxLoadPerPhase);
      if (!isNaN(slotsCount) && !isNaN(maxLoad) && slotsCount > maxLoad) {
        workerOverloads.add(row.WorkerID);
      }
    });
  }

  // Skill coverage (basic check — no worker data yet)
  if (fileName === "task.csv" && columns.includes("RequiredSkill")) {
    const requiredSkills = new Set(data.map((row) => row.RequiredSkill).filter(Boolean));
    const availableSkills = new Set(); // TODO: load worker skills to compare properly

    requiredSkills.forEach((skill) => {
      if (!availableSkills.has(skill)) {
        skillCoverageErrors.add(skill);
      }
    });
  }

  // Implement maxConcurrencyErrors and phaseSaturationErrors using worker data

  setters.setInvalidJsonRows(invalidJsonRows);
  setters.setNumericErrors(numericErrors);
  setters.setInvalidReferences(invalidReferences);
  setters.setCircularGroups(circularGroups);
  setters.setPhaseConflicts(phaseConflicts);
  setters.setWorkerOverloads(workerOverloads);
  setters.setPhaseSaturationErrors(phaseSaturationErrors);
  setters.setSkillCoverageErrors(skillCoverageErrors);
  setters.setMaxConcurrencyErrors(maxConcurrencyErrors);
}
