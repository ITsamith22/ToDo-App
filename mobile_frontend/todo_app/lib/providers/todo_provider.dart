import 'package:flutter/material.dart';
import 'package:todo_app/widgets/todos/todo_item.dart';
import '../services/todo_service.dart';

class TodoProvider extends ChangeNotifier {
  final TodoService _todoService = TodoService();
  List<TodoItem> _todos = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  List<TodoItem> get todos => _todos;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Fetch all todos
  Future<void> fetchTodos() async {
    _setLoading(true);
    try {
      final todos = await _todoService.getTodos();
      _todos = todos;
      _setError(null);
    } catch (e) {
      _setError('Failed to fetch todos: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Add a new todo
  Future<void> addTodo(TodoItem todo) async {
    _setLoading(true);
    try {
      final newTodo = await _todoService.createTodo(todo);
      if (newTodo != null) {
        _todos.add(newTodo);
        _setError(null);
      } else {
        _setError('Failed to add todo');
      }
    } catch (e) {
      _setError('Failed to add todo: $e');
    } finally {
      _setLoading(false);
      notifyListeners();
    }
  }

  // Update a todo
  Future<void> updateTodo(String id, TodoItem todo) async {
    _setLoading(true);
    try {
      final updatedTodo = await _todoService.updateTodo(id, todo);
      if (updatedTodo != null) {
        final index = _todos.indexWhere((item) => item.id == id);
        if (index != -1) {
          _todos[index] = updatedTodo;
          _setError(null);
        }
      } else {
        _setError('Failed to update todo');
      }
    } catch (e) {
      _setError('Failed to update todo: $e');
    } finally {
      _setLoading(false);
      notifyListeners();
    }
  }

  // Delete a todo
  Future<void> deleteTodo(String id) async {
    _setLoading(true);
    try {
      final success = await _todoService.deleteTodo(id);
      if (success) {
        _todos.removeWhere((item) => item.id == id);
        _setError(null);
      } else {
        _setError('Failed to delete todo');
      }
    } catch (e) {
      _setError('Failed to delete todo: $e');
    } finally {
      _setLoading(false);
      notifyListeners();
    }
  }

  // Mark todo as completed
  Future<void> markAsCompleted(String id) async {
    _setLoading(true);
    try {
      final updatedTodo = await _todoService.markAsCompleted(id);
      if (updatedTodo != null) {
        final index = _todos.indexWhere((item) => item.id == id);
        if (index != -1) {
          _todos[index] = updatedTodo;
          _setError(null);
        }
      } else {
        _setError('Failed to mark todo as completed');
      }
    } catch (e) {
      _setError('Failed to mark todo as completed: $e');
    } finally {
      _setLoading(false);
      notifyListeners();
    }
  }

  // Mark todo as pending
  Future<void> markAsPending(String id) async {
    _setLoading(true);
    try {
      final updatedTodo = await _todoService.markAsPending(id);
      if (updatedTodo != null) {
        final index = _todos.indexWhere((item) => item.id == id);
        if (index != -1) {
          _todos[index] = updatedTodo;
          _setError(null);
        }
      } else {
        _setError('Failed to mark todo as pending');
      }
    } catch (e) {
      _setError('Failed to mark todo as pending: $e');
    } finally {
      _setLoading(false);
      notifyListeners();
    }
  }

  // Helper methods
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String? value) {
    _error = value;
    notifyListeners();
  }
}