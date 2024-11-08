import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import Note from './components/Note';
import NotesList from './components/NotesList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#2563EB" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {user ? (
        <div className="p-4 sm:p-6 max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-4 sm:mb-0">
              Welcome to NoteSpark, {user.email}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
          <Note />
          <div className="mt-8">
            <NotesList userId={user.uid} />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
