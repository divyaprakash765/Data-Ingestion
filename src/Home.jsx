import React, { useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { url } from './constant';

const Home = ({ setCorrectedText }) => {
  const [columns, setColumns] = useState([]);
  const [editableData, setEditableData] = useState([]);

  const navigate = useNavigate(); // ✅ Correct name

  const prompt = async (columnName) => {
    if (!editableData.length || !columnName) return;

    const textsToCheck = editableData
      .map((row, i) => `${i + 1}. ${row[columnName] || ""}`)
      .join("\n");

    const payload = {
      contents: [{
        parts: [{
          text: `Please check and correct the spelling mistakes in the following text:\n${textsToCheck}`
        }]
      }]
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const corrected = data.candidates?.[0]?.content?.parts?.[0]?.text;

      setCorrectedText(corrected || "No corrections found.");
      navigate('/corrections');
    } catch (error) {
      console.error("Error checking spelling:", error);
    }
  };

  const handleFile = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const cols = Object.keys(rows[0]);
        setColumns(cols);
        setEditableData(rows);
      }
    });
  };

  const handleEdit = (rowIndex, key, value) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][key] = value;
    setEditableData(updatedData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <select
        onChange={(e) => prompt(e.target.value)}
        className="my-10 p-2 border rounded"
      >
        <option value="">Select Column to Spell Check</option>
        {columns.map(col => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>

      <h1 className="text-4xl font-bold my-10 border-b-4 border-black border-dashed pb-2">
        Data Ingestion
      </h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="text-lg font-semibold my-4"
      />

      {editableData.length > 0 && (
        <div className="overflow-x-auto w-full max-w-5xl mt-6">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-200">
                {columns.map((col, index) => (
                  <th key={index} className="border px-4 py-2 text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">
                      <input
                        type="text"
                        value={row[col]}
                        onChange={(e) => handleEdit(rowIndex, col, e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
