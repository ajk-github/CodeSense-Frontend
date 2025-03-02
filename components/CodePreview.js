// File: frontend/components/CodePreview.js
import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const CodePreview = ({ content }) => {
  return (
    <div style={{ height: "500px", border: "1px solid #ccc" }}>
      <MonacoEditor height="100%" language="javascript" value={content} theme="vs-dark" />
    </div>
  );
};

export default CodePreview;
