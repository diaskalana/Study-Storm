import React from "react";
import { useLocation } from "react-router-dom";

const CardPage = () => {
  // Extracting email and courseId from the URL query params
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const userEmail = queryParams.get("email");
  const courseId = queryParams.get("courseId");

  return (
    <div>
      <h1>Card Page</h1>
      <p>User Email: {userEmail}</p>
      <p>Course ID: {courseId}</p>
      {/* Add your logic here */}
    </div>
  );
};

export default CardPage;
