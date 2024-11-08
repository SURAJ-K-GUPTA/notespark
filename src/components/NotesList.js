import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function NotesList({ userId }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
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
        <div className="flex justify-center items-center min-h-[50vh]">
          <ClipLoader color="#2563EB" size={50} />
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <li
                key={note.id}
                className="bg-white p-4 rounded shadow-md relative transition transform hover:scale-105 sm:w-full md:w-3/4 lg:w-1/2 mx-auto"
              >
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
