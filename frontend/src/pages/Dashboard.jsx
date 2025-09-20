import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';
import Loading from '../components/layout/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, fetchStats, loading } = useTodos();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return <Loading text="Loading dashboard..." />;
  }

  const statsCards = [
    {
      title: 'Total Todos',
      value: stats?.totalTodos || 0,
      icon: CheckSquare,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats?.completedTodos || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending',
      value: stats?.pendingTodos || 0,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'High Priority',
      value: stats?.highPriorityTodos || 0,
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  const completionRate = stats?.totalTodos > 0 
    ? Math.round((stats.completedTodos / stats.totalTodos) * 100)
    : 0;

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your todos today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <Link
            to="/todos/new"
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Todo
          </Link>
          <Link
            to="/todos"
            className="btn btn-secondary flex items-center"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            View All Todos
          </Link>
          <Link
            to="/stats"
            className="btn btn-secondary flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Statistics
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card) => (
          <div key={card.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Completion Rate
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            You've completed {stats?.completedTodos || 0} out of {stats?.totalTodos || 0} todos
          </p>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Priority Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">High Priority</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.highPriorityTodos || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Medium Priority</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.mediumPriorityTodos || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Low Priority</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.lowPriorityTodos || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;