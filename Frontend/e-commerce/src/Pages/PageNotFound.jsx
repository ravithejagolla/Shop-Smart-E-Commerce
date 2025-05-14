// Pages/PageNotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-btn">
        Go to Homepage
      </Link>
    </div>
  );
}

export default PageNotFound;
