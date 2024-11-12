import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function NoteEdit({ noteId, handleEditToggle }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;

      setLoading(true);
      try {
        const noteRef = doc(db, 'notes', noteId);
        const docSnap = await getDoc(noteRef);

        if (docSnap.exists()) {
          const noteData = docSnap.data();
          setTitle(noteData.title || '');
          setContent(noteData.content || '');
          setTags(noteData.tags ? noteData.tags.join(', ') : '');
        } else {
          toast.error("Note not found.");
        }
      } catch (error) {
        toast.error("Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        toast.error("User is not authenticated.");
        setLoading(false);
        return;
      }

      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        updatedAt: Timestamp.fromDate(new Date()),
        userId,
      });
    handleEditToggle(noteId);
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded shadow-md max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Edit Note</h2>
      
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

export default NoteEdit;
