import React from "react";
import "./DiscussionForumAnnouncement.css"; // We'll create this CSS file next

const EKUM_FORUM_URL = "https://devnulp.niua.org/discussion-forum/"; // Replace with actual URL if different

const DiscussionForumAnnouncement = () => {
  const handleRedirect = () => {
    window.location.href = EKUM_FORUM_URL;
  };

  return (
    <div className="announcement-container">
      {/* Image above the announcement bar */}
      {/* <img
        src={require(`../assets/dfannouncement.png`)}
        alt="EkUM Announcement"
        onClick={handleRedirect}
        className="announcement-image"
      /> */}
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div>
          <div className="announcement-title">
            Visit the new and revamped Discussion Forum
          </div>
          <div className="announcement-subtitle">
            A one of its kind discussion forum for all Urban Practitioners
          </div>
        </div>
        <a
          href={EKUM_FORUM_URL}
          rel="noopener noreferrer"
          className="announcement-button"
        >
          Go to EkUM Discussion Forum
        </a>
      </div>
    </div>
  );
};

export default DiscussionForumAnnouncement;
