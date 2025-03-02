// File: frontend/components/ModelSelector.js
import React from 'react';

export default function ModelSelector({ onModelChange }) {
  const models = [
    { id: "ibm/granite-3-8b-instruct", name: "IBM Granite 3-8B Instruct" },
    { id: "starcoder", name: "StarCoder" },
    { id: "codellama", name: "Code LLaMA" },
  ];

  return (
    <div style={styles.container}>
      <label htmlFor="model-select" style={styles.label}>Select Model:</label>
      <select
        id="model-select"
        onChange={(e) => onModelChange(e.target.value)}
        style={styles.select}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  label: {
    color: '#ccc',
    fontSize: '1rem',
    marginBottom: '5px',
    display: 'block',
    fontFamily: "'Inter', sans-serif",
  },
  select: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #444',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
  },
};
