import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import Layout from './components/layout/Layout';
import Loading from './components/layout/Loading';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TodoList from './pages/todos/TodoList';
import TodoForm from './pages/todos/TodoForm';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoProvider>
              <Layout />
            </TodoProvider>
          </ProtectedRoute>
        }
      >
        {/* Nested routes inside Layout */}
        <Route index element={<Dashboard />} />
        <Route path="todos" element={<TodoList />} />
        <Route path="todos/new" element={<TodoForm />} />
        <Route path="todos/edit/:id" element={<TodoForm />} />
        <Route path="stats" element={<Statistics />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;