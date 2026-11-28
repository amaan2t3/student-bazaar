import api from './api';

export const noteService = {
  // Public: list all notes with optional filters
  async getNotes(params = {}) {
    try {
      const response = await api.get('/notes', { params });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load notes.';
    }
  },

  // Public: get a single note by ID
  async getNoteById(id) {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load note.';
    }
  },

  // Admin: create a new note
  async createNote(data) {
    try {
      const response = await api.post('/notes', data);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to create note.';
    }
  },

  // Admin: update an existing note
  async updateNote(id, data) {
    try {
      const response = await api.put(`/notes/${id}`, data);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update note.';
    }
  },

  // Admin: delete a note
  async deleteNote(id) {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to delete note.';
    }
  },
};

export default noteService;
