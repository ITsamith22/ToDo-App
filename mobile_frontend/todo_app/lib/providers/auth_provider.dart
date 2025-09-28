import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;
  
  final AuthService _authService = AuthService();
  
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  
  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _user = await _authService.login(email, password);
      _error = null;
    } catch (e) {
      _error = _cleanErrorMessage(e.toString());
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> register(String username, String email, String password, {File? profileImage}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _user = await _authService.register(username, email, password, profileImage: profileImage);
      _error = null;
    } catch (e) {
      _error = _cleanErrorMessage(e.toString());
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    
    await _authService.logout();
    _user = null;
    _error = null;
    
    _isLoading = false;
    notifyListeners();
  }
  
  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _user = await _authService.getCurrentUser();
      _error = null;
    } catch (e) {
      _user = null;
      _error = null; // Don't show error on initial auth check
    }
    
    _isLoading = false;
    notifyListeners();
  }
  
  String _cleanErrorMessage(String error) {
    // Remove "Exception: " prefix if present
    if (error.startsWith('Exception: ')) {
      return error.substring(11);
    }
    return error;
  }
}