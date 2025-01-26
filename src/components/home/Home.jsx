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
    <div className="min-h-screen bg-black text-gray-800 font-poppins">
      {user ? (
        <>
          <div className="fixed top-0 left-0 right-0 flex items-center justify-between w-full p-4 bg-transparent">
            <div className="flex items-center space-x-4">
              <img src={user.photoURL} alt="User Profile" className="w-10 h-10 rounded-full" />
              <h1 className="text-2xl font-semibold text-white">
                Hey! {user.displayName}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-white font-bold"
            >
              Logout
            </button>
          </div>
          
          {/* Chat List Component */}
          <ChatList />
        </>
      ) : (
        <p className="text-2xl font-semibold text-white flex justify-center items-center h-full">Loading...</p>
      )}
    </div>
  );
}

export default HomeUi;
