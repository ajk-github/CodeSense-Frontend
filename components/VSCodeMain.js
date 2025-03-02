// File: frontend/components/VSCodeMain.js
import React, { useState } from 'react';
import axios from 'axios';
import ModelSelector from './ModelSelector';
import Chatbot from './Chatbot';
import dynamic from 'next/dynamic';
import { Tree } from 'react-arborist';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function VSCodeMain({ option, files, githubLink, folderName }) {
  const [activeTabs, setActiveTabs] = useState([]); 
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [summary, setSummary] = useState("");
  const [developerGuide, setDeveloperGuide] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [modelId, setModelId] = useState("ibm/granite-3-8b-instruct");

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await axios.post('/api/analyze/', {
        files: files,
        model_id: modelId
      });
      setSummary(response.data.summary);
      setDeveloperGuide(response.data.developer_guide);

      setActiveTabs([
        ...activeTabs,
        { name: "Summary.txt", content: response.data.summary },
        { name: "DeveloperGuide.md", content: response.data.developer_guide }
      ]);
      setActiveTabIndex(activeTabs.length); 
      setShowChatbot(true);
    } catch (error) {
      console.error("Summarize error:", error);
    }
    setIsSummarizing(false);
  };

  const closeTab = (index) => {
    const updatedTabs = [...activeTabs];
    updatedTabs.splice(index, 1);
    setActiveTabs(updatedTabs);
    if (index === activeTabIndex) {
      setActiveTabIndex(Math.max(0, index - 1));
    } else if (index < activeTabIndex) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  // Download functionality
  const handleDownload = (tab) => {
    const element = document.createElement("a");
    const file = new Blob([tab.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = tab.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          {/* {option === "github" && (
            <div style={styles.githubLink}>GitHub: {githubLink}</div>
          )} */}
          <ModelSelector onModelChange={setModelId} />

          {/* Display Selected Folder Name */}
          {(folderName || githubLink) && (
  <div style={styles.folderName}>
    {folderName ? (
      <>Selected Folder: 🗁 <strong>{folderName}</strong></>
    ) : (
      <>Selected GitHub Repo: 🔗 
        <strong>
          <a href={githubLink} target="_blank" rel="noopener noreferrer" 
             style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>
            {githubLink}
          </a>
        </strong>
      </>
    )}
  </div>
)}





          <button style={styles.button} onClick={handleSummarize}>
            Summarize Codebase
          </button>
          {isSummarizing && (
            <>
              <p style={{ 
                fontFamily: "'Inter', sans-serif", 
                color: '#9e9e9e', 
                fontSize: '1rem', 
                marginTop: '10px', 
                fontStyle: 'italic'
              }}>
                Summarizing...
              </p>
              <div style={styles.loadingBarWrapper}>
                <div style={styles.loadingBar}></div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.tabBar}>
          {activeTabs.map((tab, idx) => (
            <div
              key={idx}
              style={{
                ...styles.tab,
                backgroundColor: idx === activeTabIndex ? '#2d2d2d' : '#1e1e1e'
              }}
            >
              <span onClick={() => setActiveTabIndex(idx)} style={styles.tabTitle}>
                {tab.name}
              </span>
              <span 
                style={styles.downloadIcon} 
                title="Download" 
                onClick={() => handleDownload(tab)}
              >
                ⭳
              </span>
              <span style={styles.tabClose} onClick={() => closeTab(idx)}>
              ⮿
              </span>
            </div>
          ))}
        </div>
        <div style={styles.editor}>
          {activeTabs.length > 0 && (
            <MonacoEditor
              height="100%"
              language="markdown"
              theme="vs-dark"
              value={activeTabs[activeTabIndex]?.content || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false }
              }}
            />
          )}
        </div>

        {showChatbot && (
          <div style={styles.chatbotContainer}>
            <Chatbot context={summary} modelId={modelId} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 50px)',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: '#101010',
  },
  sidebarTop: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#ffffff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tabBar: {
    display: 'flex',
    backgroundColor: '#1e1e1e',
    borderBottom: '1px solid #333',
    padding: '8px',
    gap: '8px',
  },
  tab: {
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabTitle: {
    cursor: 'pointer',
  },
  downloadIcon: {
    cursor: 'pointer',
    color: 'white',
    fontSize: '1.2rem',
  },
  tabClose: {
    cursor: 'pointer',
    color: 'white',
    marginLeft: '8px',
  },
  editor: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  chatbotContainer: {
    height: '300px',
    overflowY: 'auto',
    backgroundColor: '#252526',
    padding: '10px',
    borderTop: '1px solid #333',
  },
  loadingBarWrapper: {
    width: '100%',
    height: '4px',
    backgroundColor: '#333',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '5px',
    position: 'relative',
  },
  loadingBar: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'translateX(-100%)',
    animation: 'loadingAnimation 2s linear infinite',
  },
  folderName: {
    color: '#ccc',
    fontSize: '0.9rem',
    margin: '10px 0',
    fontFamily: "'Inter', sans-serif",
  }

};

const keyframes = `
  @keyframes loadingAnimation {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);
}
