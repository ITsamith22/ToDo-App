import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import userService from '../services/userService';
import Loading from '../components/layout/Loading';

const Statistics = () => {
  const { stats, fetchStats } = useTodos();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      await fetchStats();
      const response = await userService.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading statistics..." />;
  }

  const completionRate = stats?.totalTodos > 0 
    ? Math.round((stats.completedTodos / stats.totalTodos) * 100)
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
        <p className="text-gray-600">
          Track your productivity and todo completion patterns
        </p>
      </div>

      {/* User Statistics */}
      {userStats && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(userStats.user.memberSince).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Days Active</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userStats.user.daysSinceRegistration}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userStats.todoStats.completionRate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Todo Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Todo Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Todos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalTodos || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.completedTodos || 0}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats?.pendingTodos || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats?.highPriorityTodos || 0}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Rate Circle */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Overall Completion Rate
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {completionRate}%
                  </span>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {stats?.completedTodos || 0} out of {stats?.totalTodos || 0} todos completed
            </p>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Priority Distribution
          </h3>
          <div className="space-y-4">
            {/* High Priority */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">High Priority</span>
                <span className="text-sm text-gray-900 font-medium">
                  {stats?.highPriorityTodos || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ 
                    width: `${stats?.totalTodos ? (stats.highPriorityTodos / stats.totalTodos) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Medium Priority</span>
                <span className="text-sm text-gray-900 font-medium">
                  {stats?.mediumPriorityTodos || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${stats?.totalTodos ? (stats.mediumPriorityTodos / stats.totalTodos) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Low Priority</span>
                <span className="text-sm text-gray-900 font-medium">
                  {stats?.lowPriorityTodos || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${stats?.totalTodos ? (stats.lowPriorityTodos / stats.totalTodos) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {stats?.totalTodos === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No todos to analyze yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;