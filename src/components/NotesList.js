import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function NotesList({ userId }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.error("No user ID available for querying notes.");
      return;
    }

    console.log("Attempting to fetch notes for userId:", userId);

    const q = query(
        collection(db, 'notes'),
        orderBy('createdAt', 'desc')
      );
      

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot size:", snapshot.size); // Check how many documents were retrieved
      const notesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Notes data:", notesData); // Log the actual data retrieved
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title or tags"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {loading ? (
        <div className="text-center text-lg font-semibold">Loading notes...</div>
      ) : (
        <ul className="space-y-4">
        {filteredNotes.length > 0 ? (
  filteredNotes
    .filter(note => note.userId === userId) // Filter notes by userId
    .map(note => (
      <li key={note.id} className="bg-white p-4 rounded shadow-md relative">
        <button
          onClick={() => handleDelete(note.id)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          aria-label="Delete Note"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <p>{note.content}</p>
        <p className="text-sm text-gray-500">Tags: {note.tags.join(', ')}</p>
      </li>
    ))
) : (
  <div className="text-center text-gray-600">No notes found.</div>
)}

        </ul>
      )}
    </div>
  );
}

export default NotesList;
