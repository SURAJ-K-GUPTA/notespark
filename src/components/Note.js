import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function Note() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoading(true);

    try {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        toast.error("User is not authenticated.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'notes'), {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: Timestamp.fromDate(new Date()),
        userId
      });

      toast.success("Note saved successfully!");
      setTitle('');
      setContent('');
      setTags('');
    } catch (error) {
      toast.error("Failed to save note");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded shadow-md max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Add a New Note</h2>
      
      <form onSubmit={handleSave}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 mb-3 border border-gray-300 rounded resize-none"
          rows="4"
        ></textarea>
        
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-500 text-white p-2 rounded w-full"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : "Save Note"}
        </button>
      </form>
    </div>
  );
}

export default Note;
