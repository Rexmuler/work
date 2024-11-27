import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./Home.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-6PQJ92Qz9tXKW940DcYnpXS_dIGjVDE",
  authDomain: "login-for-work.firebaseapp.com",
  projectId: "login-for-work",
  storageBucket: "login-for-work.firebasestorage.app",
  messagingSenderId: "294972844511",
  appId: "1:294972844511:web:ae8007a8e36b193aa2fc6a",
  measurementId: "G-ZZ0NYFE437",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const firebaseErrors = {
    "auth/internal-error": "An internal error occurred. Please try again later.",
    "auth/invalid-credential": "User not found. Please sign up first.",
    "auth/cancelled-popup-request": "Popup request was cancelled.",
    "auth/popup-closed-by-user":
      "The popup was closed before completing the sign-in.",
    "auth/operation-not-allowed": "This operation is not allowed. Contact support.",
    "auth/email-already-in-use": "This email is already in use. Try signing in.",
    "auth/weak-password": "The password is too weak. Please use a stronger one.",
    "auth/user-disabled": "This user account has been disabled.",
    "auth/user-not-found": "No user found with these credentials.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
  };

  

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user); // Save user to Firestore
      navigate("/dashboard"); // Redirect to Dashboard
    } catch (err) {
      const friendlyMessage =
        firebaseErrors[err.code] || "An unknown error occurred.";
      setError(friendlyMessage);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to Dashboard
    } catch (err) {
      const friendlyMessage =
        firebaseErrors[err.code] || "An unknown error occurred.";
      setError(friendlyMessage);
    }
  };

  return (
    <div className="signup-container">
      <h1>Welcome</h1>
      <div className="social-signup">
        <button className="google-signup" onClick={handleGoogleSignIn}>
          <img
            id="google-img"
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="Google Logo"
          />
          Continue with Google
        </button>
        <button className="facebook-signup">
          <img
            id="facebook-img"
            src="https://img.icons8.com/color/48/000000/facebook.png"
            alt="Facebook Logo"
          />
          Continue with Facebook
        </button>
      </div>
      <div className="or-divider">
        <span>OR</span>
      </div>
      <form className="signup-form" onSubmit={handleEmailSignIn}>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="terms">
          <label htmlFor="terms">
            I agree to the Freelancer <a href="#">User Agreement</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </label>
        </div>
        <button type="submit" className="join-btn">
          Log In
        </button>
      </form>
      {error && (
        <p
          className="error-message"
          style={{ color: "red", marginTop: "10px" }}
        >
          {error}
        </p>
      )}
      <p className="login-link">
        Don't have an account? <a href="sign">Sign up</a>
      </p>
    </div>
  );
};

export default Home;
