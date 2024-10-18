import React from "react";
import "./../stylesheets/layout.css"; // Optional: Add styles for the loader here

const Loader = () => {
  return (
    <div className="loader">
      {/* You can customize this loader's appearance */}
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
