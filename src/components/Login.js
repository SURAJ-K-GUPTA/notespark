import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login / Sign Up</h2>
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
        <button onClick={handleSignIn} className="w-full bg-blue-500 text-white p-2 rounded mb-2">Sign In</button>
        <button onClick={handleSignUp} className="w-full bg-green-500 text-white p-2 rounded">Sign Up</button>
      </div>
    </div>
  );
}

export default Login;
