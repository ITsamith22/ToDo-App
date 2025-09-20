import React, { createContext, useState, useContext, useCallback } from 'react';
import todoService from '../services/todoService';
import toast from 'react-hot-toast';

const TodoContext = createContext();

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Fetch todos with current filters
  const fetchTodos = useCallback(async (newFilters = filters) => {
    try {
      setLoading(true);
      const response = await todoService.getTodos(newFilters);
      
      if (response.success) {
        setTodos(response.data);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error('Fetch todos error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create new todo
  const createTodo = async (todoData) => {
    try {
      setLoading(true);
      const response = await todoService.createTodo(todoData);
      
      if (response.success) {
        toast.success('Todo created successfully!');
        await fetchTodos();
        await fetchStats();
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create todo';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async (id, todoData) => {
    try {
      setLoading(true);
      const response = await todoService.updateTodo(id, todoData);
      
      if (response.success) {
        toast.success('Todo updated successfully!');
        await fetchTodos();
        await fetchStats();
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update todo';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await todoService.deleteTodo(id);
      
      if (response.success) {
        toast.success('Todo deleted successfully!');
        await fetchTodos();
        await fetchStats();
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete todo';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Toggle todo status
  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const response = currentStatus === 'pending' 
        ? await todoService.markAsCompleted(id)
        : await todoService.markAsPending(id);
      
      if (response.success) {
        const newStatus = response.data.status;
        toast.success(`Todo marked as ${newStatus}!`);
        await fetchTodos();
        await fetchStats();
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update todo status';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Fetch todo statistics
  const fetchStats = async () => {
    try {
      const response = await todoService.getTodoStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchTodos(updatedFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      status: '',
      priority: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    fetchTodos(defaultFilters);
  };

  const value = {
    todos,
    loading,
    stats,
    filters,
    pagination,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    fetchStats,
    updateFilters,
    resetFilters,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;