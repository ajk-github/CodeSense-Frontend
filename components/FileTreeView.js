// File: frontend/components/FileTreeView.js
import React from 'react';

const FileTreeView = ({ fileStructure, onFileSelect }) => {
  return (
    <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
      {fileStructure.map((file, idx) => (
        <li key={idx} style={{ cursor: "pointer" }} onClick={() => onFileSelect(file.content)}>
          {file.name}
        </li>
      ))}
    </ul>
  );
};

export default FileTreeView;
