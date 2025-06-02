import React, { useState } from 'react';
import EntryVideoWithText from './EntryVideoWithText';
import Home from './Home';

const EntryPage = () => {
  const [showVideo, setShowVideo] = useState(true);

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  return (
    <>
      {showVideo ? (
        <EntryVideoWithText onVideoEnd={handleVideoEnd} />
      ) : (
        <Home />
      )}
    </>
  );
};

export default EntryPage;
