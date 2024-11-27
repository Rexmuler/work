import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Sign.css";

// Your Firebase configuration
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
const db = getFirestore(app); // Initialize Firestore

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const firebaseErrors = {
    "auth/internal-error": "An internal error occurred. Please try again later.",
    "auth/invalid-credential": "Incorrect Email Or Password.",
    "auth/cancelled-popup-request": "Popup request was cancelled.",
    "auth/popup-closed-by-user": "The popup was closed before completing the sign-in.",
    "auth/operation-not-allowed": "This operation is not allowed. Contact support.",
    "auth/email-already-in-use": "This email is already in use. Try signing in.",
    "auth/weak-password": "The password is too weak. Please use a stronger one.",
    "auth/user-disabled": "This user account has been disabled.",
    "auth/user-not-found": "No user found with these credentials.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: "Google User", // Default name for Google signups
        lastName: "",
        email: user.email,
        createdAt: new Date(),
      });

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const friendlyMessage =
        firebaseErrors[err.code] || "An unknown error occurred.";
      setError(friendlyMessage);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: fname,
        lastName: lname,
        email: user.email,
        createdAt: new Date(),
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      const friendlyMessage =
        firebaseErrors[err.code] || "An unknown error occurred.";
      setError(friendlyMessage);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign up</h1>
      <div className="social-signup">
        <button className="google-signup" onClick={handleGoogleSignUp}>
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
      <form className="signup-form" onSubmit={handleEmailSignUp}>
        <div className="input-group">
          <input
            value={fname}
            onChange={(e) => setfname(e.target.value)}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            value={lname}
            onChange={(e) => setlname(e.target.value)}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
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
          Join Me
        </button>
      </form>
      {error && (
        <p className="error-message" style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
      {success && (
        <p className="success-message" style={{ color: "green", marginTop: "10px" }}>
          {success}
        </p>
      )}
      <p className="login-link">
        Already have an account? <a href="/">Log in</a>
      </p>
    </div>
  );
};

export default SignUp;
