// File: frontend/components/GetStartedModal.js
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9.\-_/]/g, '');
}

/**
 * Read a local directory using the File System Access API (unchanged).
 */
const readDirectory = async (dirHandle, path = "") => {
  const entries = [];
  for await (const entry of dirHandle.values()) {
    const safeName = sanitizeFileName(entry.name);
    if (entry.kind === "file") {
      const file = await entry.getFile();
      let content = "";
      // Basic text check
      if (
        file.type.startsWith("text/") ||
        file.name.match(/\.(txt|md|js|py|html|css|json|ts|jsx|tsx|c|cpp|java|cs)$/i)
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

/**
 * Recursively fetch the contents of a public GitHub repo using the Contents API,
 * *without* specifying User-Agent or Accept headers.
 *
 * @param {string} owner - e.g. 'facebook'
 * @param {string} repo - e.g. 'react'
 * @param {string} [branch='main']
 * @param {string} [path=''] - subfolder within the repo
 * @returns {Promise<Array<{name: string, content: string}>>}
 */
async function fetchRepoContents(owner, repo, branch = 'main', path = '') {
  const result = [];

  // The GitHub Contents API endpoint for a given path:
  // https://api.github.com/repos/:owner/:repo/contents/:path?ref=:branch
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const GITHUB_TOKEN = "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";


  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  });
  if (!response.ok) {
    // 404 if path doesn't exist, 403 if rate-limited or other issues
    throw new Error(`Failed to fetch contents at path "${path}". Status: ${response.status}`);
  }

  const data = await response.json();

  // data can be an object if path points to a single file,
  // or an array if it's a directory. We handle both.
  const items = Array.isArray(data) ? data : [data];

  // For each item, if it's a directory, recurse, if it's a file, fetch content if needed
  for (const item of items) {
    if (item.type === 'dir') {
      // Recurse into the subdirectory
      const subDir = await fetchRepoContents(owner, repo, branch, item.path);
      result.push(...subDir);
    } else if (item.type === 'file') {
      const fileName = item.path;  // e.g. "src/index.js"
      const safeName = sanitizeFileName(fileName);

      // By default, set binary placeholder
      let content = "[Binary file, preview not available]";

      // If we detect a text-like file extension, fetch the 'download_url'
      if (fileName.match(/\.(txt|md|js|py|html|css|json|ts|jsx|tsx|c|cpp|java|cs)$/i)) {
        if (item.download_url) {
          const fileResponse = await fetch(item.download_url);
          if (fileResponse.ok) {
            content = await fileResponse.text();
          }
        }
      }

      result.push({ name: safeName, content });
    }
  }

  return result;
}

/**
 * A helper function to parse a GitHub URL and retrieve:
 * - owner
 * - repo
 * - branch (defaults to 'main' if none found)
 *
 * Examples:
 *   https://github.com/owner/repo
 *   https://github.com/owner/repo/tree/some-branch
 */
function parseGithubUrl(url) {
  try {
    const trimmed = url.replace(/\/+$/, ""); // remove trailing slash
    const parts = trimmed.split("/");        // e.g. ["https:", "", "github.com", "owner", "repo", "tree", "some-branch"]

    const owner = parts[3];
    const repo = parts[4];
    let branch = 'main';

    if (parts[5] === "tree" && parts[6]) {
      branch = parts[6];
    }

    return { owner, repo, branch };
  } catch (error) {
    console.warn("Failed to parse GitHub URL:", error);
    return null;
  }
}

export default function GetStartedModal({ onClose, onProceed }) {
  const [option, setOption] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // States for GitHub fetching
  const [isFetching, setIsFetching] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");

  /**
   * Handle the radio input changes (GitHub vs Local).
   */
  const handleRadioChange = (e) => {
    setOption(e.target.value);
    // Reset states
    setUploadSuccess(false);
    setFolderName("");
    setFetchSuccess(false);
    setFetchMessage("");
  };

  /**
   * Handle local folder selection (unchanged).
   */
  const handleSelectFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const selectedFiles = await readDirectory(dirHandle);
      setFiles(selectedFiles);
      setFolderName(dirHandle.name);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  /**
   * Actually fetch the repo from GitHub using the
   * contents-based approach described above.
   */
  const handleFetchRepo = async () => {
    setIsFetching(true);
    setFetchSuccess(false);
    setFetchMessage("Fetching...");

    try {
      const info = parseGithubUrl(githubLink.trim());
      if (!info) {
        throw new Error(
          "Could not parse GitHub URL. Expected format: https://github.com/owner/repo"
        );
      }

      // fetch everything recursively
      const fetchedFiles = await fetchRepoContents(info.owner, info.repo, info.branch, "");
      setFiles(fetchedFiles);

      setFetchSuccess(true);
      setFetchMessage(
        `${info.repo} Fetched Successfully ✓ (branch: ${info.branch}).`
      );
    } catch (error) {
      console.error("Error fetching repository:", error);
      setFetchSuccess(false);
      setFetchMessage(
        "Error fetching repository. Check your link, branch, or repo privacy settings."
      );
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * Continue with the chosen option once the user confirms.
   */
  const handleSubmit = () => {
    onProceed(option, files, githubLink, folderName);
    onClose();
  };

  return createPortal(
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Add New Project</h2>

        <div style={styles.optionGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="github"
              checked={option === "github"}
              onChange={handleRadioChange}
              style={styles.radioInput}
            />
            <span style={styles.radioText}>Import from URL</span>
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="local"
              checked={option === "local"}
              onChange={handleRadioChange}
              style={styles.radioInput}
            />
            <span style={styles.radioText}>Upload Local</span>
          </label>
        </div>

        {/* -- GITHUB OPTION -- */}
        {option === "github" && (
          <div style={styles.inputWrapper}>
            <input
              type="text"
              style={styles.textInput}
              placeholder="https://github.com/owner/repo"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />

            {!fetchSuccess && (
              <button
                style={styles.continueButton}
                onClick={handleFetchRepo}
                disabled={!githubLink.trim()}
              >
                Fetch Repo
              </button>
            )}

            {/* Fetch Status */}
            {isFetching && <p style={styles.fetchMessage}>{fetchMessage}</p>}
            {!isFetching && fetchMessage && (
              <p style={styles.fetchMessage}>{fetchMessage}</p>
            )}
          </div>
        )}

        {/* -- LOCAL OPTION -- */}
        {option === "local" && (
          <>
            <button style={styles.uploadButton} onClick={handleSelectFolder}>
              Upload Folder
            </button>
            {folderName && (
              <div style={styles.uploadStatus}>
                <span>{folderName}</span>
                {uploadSuccess && (
                  <span style={styles.successMessage}>
                    Uploaded Successfully ✓
                  </span>
                )}
              </div>
            )}
          </>
        )}

        <div style={styles.buttonGroup}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.continueButton}
            onClick={handleSubmit}
            disabled={!option}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ----------------------------------------
// Styles
// ----------------------------------------
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#101010',
    color: '#fff',
    width: '380px',
    padding: '20px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#fff',
  },
  optionGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '20px',
  },
  radioLabel: {
    fontSize: '1rem',
    color: '#ccc',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '8px',
    accentColor: '#1db954',
  },
  radioText: {
    verticalAlign: 'middle',
  },
  inputWrapper: {
    marginBottom: '20px',
  },
  textInput: {
    width: '100%',
    padding: '10px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#252525',
    color: '#fff',
    fontSize: '1rem',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#9e9e9e',
    border: '1px solid #444',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'color 0.3s ease, border-color 0.3s ease',
  },
  continueButton: {
    backgroundColor: '#ffffff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  uploadStatus: {
    marginTop: '10px',
    color: '#ccc',
    fontSize: '0.9rem',
  },
  successMessage: {
    color: '#1db954',
    marginLeft: '10px',
    fontWeight: 'bold',
  },
  fetchMessage: {
    color: '#1db954',
    marginTop: '10px',
    fontSize: '0.9rem',
    color: '#ccc',
  },
};
