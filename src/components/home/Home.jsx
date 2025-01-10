import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig"; // Import Firebase auth
import { signOut } from "firebase/auth";
import ChatList from "./ChatList"; // Import ChatList component

function HomeUi() {
  const [user, setUser] = useState(null); // State to store user info
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Check user authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // User is logged in
      } else {
        navigate("/auth"); // Redirect to /auth if not logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth"); // Redirect to /auth after logout
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-purple-100 text-gray-800 flex flex-col items-center justify-center p-6 space-y-6 font-poppins">
      {user ? (
        <>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-white">
              Welcome, {user.displayName}!
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all duration-300"
            >
              Logout
            </button>
          </div>
          <p className="text-lg text-white">You are logged in with {user.email}.</p>
        </>
      ) : (
        <p className="text-2xl font-semibold text-white">Loading...</p>
      )}

      {/* Chat List Component */}
      <ChatList />
    </div>
  );
}

export default HomeUi;
