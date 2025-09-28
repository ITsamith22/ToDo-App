import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:todo_app/widgets/todos/todo_item.dart';
import '../config/api_config.dart';

class TodoService {
  final String baseUrl = ApiConfig.baseUrl;
  final storage = FlutterSecureStorage();

  // Use consistent token key
  static const String _tokenKey = 'auth_token';

  // Get auth token from secure storage
  Future<String?> _getToken() async {
    return await storage.read(key: _tokenKey);
  }

  // Get auth headers
  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Fetch all todos
  Future<List<TodoItem>> getTodos() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/todos'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return (responseData['data'] as List)
              .map((todo) => TodoItem.fromJson(todo))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching todos: $e');
      return [];
    }
  }

  // Fetch a single todo by ID
  Future<TodoItem?> getTodo(String id) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/todos/$id'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return TodoItem.fromJson(responseData['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching todo: $e');
      return null;
    }
  }

  // Create a new todo
  Future<TodoItem?> createTodo(TodoItem todo) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/todos'),
        headers: headers,
        body: json.encode(todo.toJson()),
      );

      if (response.statusCode == 201) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return TodoItem.fromJson(responseData['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error creating todo: $e');
      return null;
    }
  }

  // Update a todo
  Future<TodoItem?> updateTodo(String id, TodoItem todo) async {
    try {
      final headers = await _getHeaders();
      final response = await http.put(
        Uri.parse('$baseUrl/todos/$id'),
        headers: headers,
        body: json.encode(todo.toJson()),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return TodoItem.fromJson(responseData['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error updating todo: $e');
      return null;
    }
  }

  // Delete a todo
  Future<bool> deleteTodo(String id) async {
    try {
      final headers = await _getHeaders();
      final response = await http.delete(
        Uri.parse('$baseUrl/todos/$id'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        return responseData['success'] == true;
      }
      return false;
    } catch (e) {
      print('Error deleting todo: $e');
      return false;
    }
  }

  // Mark todo as completed
  Future<TodoItem?> markAsCompleted(String id) async {
    try {
      final headers = await _getHeaders();
      final response = await http.patch(
        Uri.parse('$baseUrl/todos/$id/complete'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return TodoItem.fromJson(responseData['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error marking todo as completed: $e');
      return null;
    }
  }

  // Mark todo as pending
  Future<TodoItem?> markAsPending(String id) async {
    try {
      final headers = await _getHeaders();
      final response = await http.patch(
        Uri.parse('$baseUrl/todos/$id/pending'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return TodoItem.fromJson(responseData['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error marking todo as pending: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>?> getTodoStats() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('$baseUrl/todos/stats'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success'] == true && responseData['data'] != null) {
          return responseData['data'];
        }
      }
      return null;
    } catch (e) {
      print('Error fetching todo stats: $e');
      return null;
    }
  }
}
