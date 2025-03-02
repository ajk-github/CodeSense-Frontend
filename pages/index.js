import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Landing from '../components/Landing';
import VSCodeMain from '../components/VSCodeMain';
import GetStartedModal from '../components/GetStartedModal';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [githubLink, setGithubLink] = useState("");
  const [option, setOption] = useState("");  // "github" or "local"
  const [folderName, setFolderName] = useState(""); // New state for folder name

  const handleProceed = (chosenOption, chosenFiles, link, folder) => {
    setOption(chosenOption);
    setFiles(chosenFiles || []);
    setGithubLink(link || "");
    setFolderName(folder || "");  // Set the folder name
    setShowLanding(false);
  };

  return (
    <div>
      <NavBar />
      {showLanding ? (
        <Landing onOpenModal={() => setShowModal(true)} />
      ) : (
        <VSCodeMain option={option} files={files} githubLink={githubLink} folderName={folderName} />
      )}

      {showModal && (
        <GetStartedModal
          onClose={() => setShowModal(false)}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
}
