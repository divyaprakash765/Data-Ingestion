import React from 'react';
import { Link } from 'react-router-dom';

const CorrectedSpell = ({ correctedText }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Corrected Spelling Results</h1>

      <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-lg p-6 shadow-md">
        {correctedText ? (
          <pre className="whitespace-pre-wrap text-lg text-gray-800">{correctedText}</pre>
        ) : (
          <p className="text-lg text-gray-500">No corrections available.</p>
        )}
      </div>

      <Link
        to="/"
        className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default CorrectedSpell;
