import React from "react";

const FileUploader = ({ onFileLoad }) => {
  return (
    <input
      type="file"
      accept=".csv"
      onChange={(e) => {
        if (e.target.files[0]) onFileLoad(e.target.files[0]);
      }}
      className="text-lg font-semibold my-4"
    />
  );
};

export default FileUploader;
