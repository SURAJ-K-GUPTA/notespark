// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Track logged-in user

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set the logged-in user
      toast.success("Successfully signed in!");
    } catch (err) {
      toast.error("Failed to sign in. Please check your credentials.");
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast.success("Account created successfully! Please sign in.");
    } catch (err) {
      toast.error("Failed to sign up. The email may already be in use.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset user to null on logout
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Failed to log out.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {user ? (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome, {user.email}</h2>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded flex items-center justify-center"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login / Sign Up</h2>

          <form action="">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#ffffff" size={20} /> : "Sign In"}
            </button>
            <button
              onClick={handleSignUp}
              className="w-full bg-green-500 text-white p-2 rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#ffffff" size={20} /> : "Sign Up"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
