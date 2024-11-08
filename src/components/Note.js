import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Note() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = async () => {
    try {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        console.error("User ID not found.");
        toast.error("User is not authenticated.");
        return;
      }

      console.log("Saving note with userId:", userId);
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        createdAt: Timestamp.fromDate(new Date()),
        userId // Associate note with user ID
      });
      toast.success("Note saved successfully!");
      setTitle('');
      setContent('');
      setTags('');
    } catch (error) {
      toast.error("Failed to save note");
      console.error("Error saving note:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add a New Note</h2>
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
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      ></textarea>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded w-full">Save Note</button>
    </div>
  );
}

export default Note;
