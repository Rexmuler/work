import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashbord.css";

const Dashboard = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check user authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          console.error("User data not found in Firestore");
        }
      } else {
        navigate("/"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("You have been signed out.");
      navigate("/");
      window.location.reload(); // Reload to ensure cleanup
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        {userData ? (
          <>
            <h1>Welcome, {userData.firstName || "User"}!</h1>
            <p>Email: {userData.email}</p>
            <button onClick={handleSignOut} className="logout-btn">
              Logout
            </button>
            <h1 style={{marginTop:"40px"}}>I work this website in react and firebase.</h1>
          </>
        ) : (
          <p>Error loading user data. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
