import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import Loading from '../../components/layout/Loading';

const TodoList = () => {
  const {
    todos,
    loading,
    filters,
    pagination,
    fetchTodos,
    deleteTodo,
    toggleTodoStatus,
    updateFilters,
    resetFilters,
  } = useTodos();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // You can implement search functionality here
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value, page: 1 });
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodo(id);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    await toggleTodoStatus(id, currentStatus);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && todos.length === 0) {
    return <Loading text="Loading todos..." />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          My Todos
        </h1>
        <Link
          to="/todos/new"
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 input max-w-md"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          
          {(filters.status || filters.priority || filters.sortBy !== 'createdAt') && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="input"
                >
                  <option value="">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="input"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.status || filters.priority
              ? 'Try adjusting your search or filters'
              : "You haven't created any todos yet"}
          </p>
          <Link
            to="/todos/new"
            className="btn btn-primary"
          >
            Create your first todo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(todo._id, todo.status)}
                    className="mt-1"
                  >
                    {todo.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold ${
                      todo.status === 'completed' 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900'
                    }`}>
                      {todo.title}
                    </h3>
                    
                    {todo.description && (
                      <p className={`mt-1 text-sm ${
                        todo.status === 'completed' 
                          ? 'text-gray-400' 
                          : 'text-gray-600'
                      }`}>
                        {todo.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      {/* Priority */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                        {todo.priority}
                      </span>

                      {/* Due Date */}
                      {todo.dueDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(todo.dueDate)}</span>
                        </div>
                      )}

                      {/* Created Date */}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Created {formatDate(todo.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/todos/edit/${todo._id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * filters.limit + 1} to{' '}
            {Math.min(pagination.currentPage * filters.limit, pagination.totalCount)} of{' '}
            {pagination.totalCount} results
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pagination.currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <Loading size="md" text="Updating..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;