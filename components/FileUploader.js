// File: frontend/components/FileUploader.js
import React from 'react';

// Helper function to sanitize file names
function sanitizeFileName(fileName) {
  // Allow only alphanumeric, period, dash, underscore, and slash characters.
  return fileName.replace(/[^a-zA-Z0-9.\-_/]/g, '');
}

// Recursive function to read the directory structure.
// For non-text files, we set content to a placeholder.
const readDirectory = async (dirHandle, path = "") => {
  const entries = [];
  for await (const entry of dirHandle.values()) {
    const safeName = sanitizeFileName(entry.name);
    if (entry.kind === "file") {
      const file = await entry.getFile();
      let content = "";
      // Only read file as text if it looks like a text file:
      if (
        file.type.startsWith("text/") ||
        file.name.match(/\.(txt|md|js|py|html|css|json)$/i)
      ) {
        content = await file.text();
      } else {
        content = "[Binary file, preview not available]";
      }
      entries.push({ name: `${path}${safeName}`, content });
    } else if (entry.kind === "directory") {
      const subEntries = await readDirectory(entry, `${path}${safeName}/`);
      entries.push(...subEntries);
    }
  }
  return entries;
};

const FileUploader = ({ onFilesUpdate, onFileSelect }) => {
  const handleFolderSelection = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const files = await readDirectory(dirHandle);
      console.log("DEBUG: Files selected:", files);
      onFilesUpdate(files);
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  return (
    <div>
      <button onClick={handleFolderSelection}>Select Folder</button>
    </div>
  );
};

export default FileUploader;
