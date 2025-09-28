import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'dart:convert';
import '../models/user_model.dart';
import '../config/api_config.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  // Use consistent token key
  static const String _tokenKey = 'auth_token';
  
  Future<User> register(String username, String email, String password, {File? profileImage}) async {
    try {
      if (profileImage != null) {
        // Use multipart form data for file upload
        return await _registerWithImage(username, email, password, profileImage);
      } else {
        // Use regular JSON API
        final data = {
          'username': username,
          'email': email,
          'password': password,
        };
        
        final response = await _apiService.post(ApiConfig.register, data);
        final user = User.fromJson(response['data'], token: response['data']['token']);
        
        // Save token with consistent key
        await _storage.write(key: _tokenKey, value: user.token);
        
        return user;
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
  
  Future<User> _registerWithImage(String username, String email, String password, File profileImage) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
      );

      // Add form fields
      request.fields['username'] = username;
      request.fields['email'] = email;
      request.fields['password'] = password;

      // Determine content type based on file extension
      final String extension = profileImage.path.split('.').last.toLowerCase();
      MediaType contentType;
      switch (extension) {
        case 'png':
          contentType = MediaType('image', 'png');
          break;
        case 'gif':
          contentType = MediaType('image', 'gif');
          break;
        case 'webp':
          contentType = MediaType('image', 'webp');
          break;
        default:
          contentType = MediaType('image', 'jpeg');
      }

      // Add the file
      var multipartFile = http.MultipartFile.fromBytes(
        'profileImage',
        await profileImage.readAsBytes(),
        filename: 'profile.$extension',
        contentType: contentType,
      );
      
      request.files.add(multipartFile);

      // Send the request
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final responseData = jsonDecode(response.body);
        if (responseData['success'] == true) {
          final user = User.fromJson(responseData['data'], token: responseData['data']['token']);
          
          // Save token
          await _storage.write(key: _tokenKey, value: user.token);
          
          return user;
        } else {
          throw Exception(responseData['message'] ?? 'Registration failed');
        }
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }
  
  Future<User> login(String email, String password) async {
    final data = {
      'email': email,
      'password': password,
    };
    
    final response = await _apiService.post(ApiConfig.login, data);
    final user = User.fromJson(response['data'], token: response['data']['token']);
    
    // Save token with consistent key
    await _storage.write(key: _tokenKey, value: user.token);
    
    return user;
  }
  
  Future<bool> logout() async {
    await _storage.delete(key: _tokenKey);
    return true;
  }
  
  Future<User?> getCurrentUser() async {
    final token = await _storage.read(key: _tokenKey);
    
    if (token == null) {
      return null;
    }
    
    try {
      final response = await _apiService.get(ApiConfig.me);
      return User.fromJson(response['data'], token: token);
    } catch (e) {
      await _storage.delete(key: _tokenKey);
      return null;
    }
  }
}