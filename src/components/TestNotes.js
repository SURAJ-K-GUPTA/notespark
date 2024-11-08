import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

function TestNotes() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  // Save a basic note to Firestore
  const handleSaveNote = async () => {
    try {
      await addDoc(collection(db, 'notes'), {
        text: noteText,
        createdAt: new Date()
      });
      toast.success("Note saved successfully!");
      setNoteText('');
      fetchNotes(); // Refresh notes after saving
    } catch (error) {
      toast.error("Failed to save note");
    }
  };

  // Fetch all notes from Firestore
  const fetchNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const notesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesData);
    } catch (error) {
      toast.error("Failed to load notes");
    }
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test Firebase Notes</h2>
      <input
        type="text"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Enter a note"
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <button onClick={handleSaveNote} className="bg-blue-500 text-white p-2 rounded w-full">Save Note</button>

      <h3 className="mt-6 text-lg font-semibold">Notes List</h3>
      <ul className="space-y-4 mt-4">
        {notes.map(note => (
          <li key={note.id} className="bg-gray-100 p-4 rounded shadow-md">
            <p>{note.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestNotes;
