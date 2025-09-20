import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, AlertCircle } from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import todoService from '../../services/todoService';
import Loading from '../../components/layout/Loading';
import toast from 'react-hot-toast';

const TodoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const { createTodo, updateTodo } = useTodos();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadTodo();
    }
  }, [id, isEdit]);

  const loadTodo = async () => {
    try {
      setLoading(true);
      const response = await todoService.getTodo(id);
      if (response.success) {
        const todo = response.data;
        setFormData({
          title: todo.title,
          description: todo.description || '',
          priority: todo.priority,
          dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
        });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to load todo');
      navigate('/todos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate || null,
    };
    
    let result;
    if (isEdit) {
      result = await updateTodo(id, todoData);
    } else {
      result = await createTodo(todoData);
    }
    
    if (result.success) {
      navigate('/todos');
    }
  };

  const handleCancel = () => {
    navigate('/todos');
  };

  if (loading) {
    return <Loading text={isEdit ? "Loading todo..." : "Creating todo..."} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Todo' : 'Create New Todo'}
        </h1>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter todo title"
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter todo description (optional)"
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Priority Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Priority Guidelines</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p><strong>High:</strong> Urgent tasks that need immediate attention</p>
                  <p><strong>Medium:</strong> Important tasks with moderate urgency</p>
                  <p><strong>Low:</strong> Tasks that can be done when time permits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Update Todo' : 'Create Todo'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;