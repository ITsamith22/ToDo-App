import api from './api';

const todoService = {
  // Get all todos with filters and pagination
  getTodos: async (params = {}) => {
    const response = await api.get('/todos', { params });
    return response.data;
  },

  // Get single todo
  getTodo: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create new todo
  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  // Mark as completed
  markAsCompleted: async (id) => {
    const response = await api.patch(`/todos/${id}/complete`);
    return response.data;
  },

  // Mark as pending
  markAsPending: async (id) => {
    const response = await api.patch(`/todos/${id}/pending`);
    return response.data;
  },

  // Get todo statistics
  getTodoStats: async () => {
    const response = await api.get('/todos/stats');
    return response.data;
  },
};

export default todoService;