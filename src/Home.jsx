import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

import { url, clientColumn, workerColumn, taskColumn } from "./constant";

import FileUploader from "./component/FileUploader";
import ColumnSelector from "./component/ColumnSelector";
import MissingColumnsWarning from "./component/MissingColumnsWarning";
import SkillCoverageWarning from "./component/SkillCoverageWarning";
import DataTable from "./component/DataTable";
import AISuggestions from "./component/AISuggestions";
import {
  runValidations,
  getMissingColumnsWithIndex,
  findDuplicates,
} from "./utils/Validations";

const Home = ({ setCorrectedText }) => {
  const [columns, setColumns] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [FileName, setFileName] = useState("");
  const [MissingColumns, setMissingColumns] = useState([]);
  const [idColumn, setIdColumn] = useState("");
  const [duplicateIDs, setDuplicateIDs] = useState(new Set());
  const [invalidJsonRows, setInvalidJsonRows] = useState(new Set());
  const [numericErrors, setNumericErrors] = useState(new Set());
  const [invalidReferences, setInvalidReferences] = useState(new Set());
  const [circularGroups, setCircularGroups] = useState(new Set());
  const [phaseConflicts, setPhaseConflicts] = useState(new Set());
  const [workerOverloads, setWorkerOverloads] = useState(new Set());
  const [phaseSaturationErrors, setPhaseSaturationErrors] = useState(new Set());
  const [skillCoverageErrors, setSkillCoverageErrors] = useState(new Set());
  const [maxConcurrencyErrors, setMaxConcurrencyErrors] = useState(new Set());
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleFile = (file) => {
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        if (!rows.length) return;

        const cols = Object.keys(rows[0]);
        setColumns(cols);
        setEditableData(rows);

        let missing = [];
        let idCol = "";

        if (file.name === "client.csv") {
          missing = getMissingColumnsWithIndex(clientColumn, cols);
          idCol = "ClientID";
        } else if (file.name === "worker.csv") {
          missing = getMissingColumnsWithIndex(workerColumn, cols);
          idCol = "WorkerID";
        } else if (file.name === "task.csv") {
          missing = getMissingColumnsWithIndex(taskColumn, cols);
          idCol = "TaskID";
        }

        setMissingColumns(missing);
        setIdColumn(idCol);

        if (idCol && rows.length > 0) {
          const ids = rows.map((row) => row[idCol]);
          const duplicates = findDuplicates(ids);
          setDuplicateIDs(duplicates);
        } else {
          setDuplicateIDs(new Set());
        }

        generateMockSuggestions(rows);
      },
    });
  };

  const handleEdit = (rowIndex, key, value) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][key] = value;
    setEditableData(updatedData);

    if (key === idColumn) {
      const ids = updatedData.map((row) => row[idColumn]);
      const duplicates = findDuplicates(ids);
      setDuplicateIDs(duplicates);
    }

    generateMockSuggestions(updatedData);
  };

  const generateMockSuggestions = (data) => {
    const suggestions = [];

    data.forEach((row, rowIndex) => {
      for (const key in row) {
        if (
          typeof row[key] === "string" &&
          row[key].toLowerCase().includes("temprary")
        ) {
          suggestions.push({
            rowIndex,
            column: key,
            oldValue: row[key],
            newValue: row[key].replace(/temprary/gi, "temporary"),
          });
        }
      }
    });

    setAiSuggestions(suggestions);
  };

  const applySuggestion = (suggestions) => {
    const updated = [...editableData];
    suggestions.forEach(({ rowIndex, column, newValue }) => {
      if (updated[rowIndex] && column in updated[rowIndex]) {
        updated[rowIndex][column] = newValue;
      }
    });
    setEditableData(updated);
    setAiSuggestions([]);
  };

  const prompt = async (columnName) => {
    if (!editableData.length || !columnName) return;

    const textsToCheck = editableData
      .map((row, i) => `${i + 1}. ${row[columnName] || ""}`)
      .join("\n");

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Please check and correct the spelling mistakes in the following text:\n${textsToCheck}`,
            },
          ],
        },
      ],
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const corrected = data.candidates?.[0]?.content?.parts?.[0]?.text;

      setCorrectedText(corrected || "No corrections found.");
      navigate("/corrections");
    } catch (error) {
      console.error("Error checking spelling:", error);
    }
  };

  useEffect(() => {
    runValidations(editableData, FileName, {
      setMissingColumns,
      setDuplicateIDs,
      setInvalidJsonRows,
      setNumericErrors,
      setInvalidReferences,
      setCircularGroups,
      setPhaseConflicts,
      setWorkerOverloads,
      setPhaseSaturationErrors,
      setSkillCoverageErrors,
      setMaxConcurrencyErrors,
    });
  }, [editableData, FileName]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <ColumnSelector columns={columns} onSelect={prompt} />

      <h1 className="text-4xl font-bold my-10 border-b-4 border-black border-dashed pb-2">
        Data Ingestion
      </h1>

      <FileUploader onFileLoad={handleFile} />

      <MissingColumnsWarning missingColumns={MissingColumns} />

      <SkillCoverageWarning missingSkills={skillCoverageErrors} />

      <DataTable
        columns={columns}
        data={editableData}
        idColumn={idColumn}
        duplicateIDs={duplicateIDs}
        invalidJsonRows={invalidJsonRows}
        numericErrors={numericErrors}
        invalidReferences={invalidReferences}
        circularGroups={circularGroups}
        phaseConflicts={phaseConflicts}
        maxConcurrencyErrors={maxConcurrencyErrors}
        workerOverloads={workerOverloads}
        onCellEdit={handleEdit}
      />

      <AISuggestions
        data={editableData}
        onApplySuggestions={applySuggestion} 
      />
    </div>
  );
};

export default Home;
