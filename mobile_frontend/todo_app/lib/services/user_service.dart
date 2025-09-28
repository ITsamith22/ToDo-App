import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class UserService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  static const String _tokenKey = 'auth_token';

  Future<String?> _getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Authorization': 'Bearer $token',
    };
  }

  // Get user profile
  Future<Map<String, dynamic>?> getProfile() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.profile}'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return data['data'];
        }
      }
      return null;
    } catch (e) {
      print('Error getting profile: $e');
      return null;
    }
  }

  // Update profile
  Future<bool> updateProfile(String username, String email) async {
    try {
      final headers = await _getHeaders();
      headers['Content-Type'] = 'application/json';
      
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/user/profile'),
        headers: headers,
        body: json.encode({
          'username': username,
          'email': email,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      print('Error updating profile: $e');
      return false;
    }
  }

  // Update profile image with better error handling
  Future<bool> updateProfileImage(File imageFile) async {
    try {
      final token = await _getToken();
      if (token == null) {
        print('No token found');
        return false;
      }

      // Validate file exists and get info
      if (!await imageFile.exists()) {
        print('Image file does not exist');
        return false;
      }

      final fileSize = await imageFile.length();
      final fileName = imageFile.path.split('/').last;
      final fileExtension = fileName.split('.').last.toLowerCase();
      
      print('File details:');
      print('- Path: ${imageFile.path}');
      print('- Name: $fileName');
      print('- Extension: $fileExtension');
      print('- Size: $fileSize bytes');

      // Validate file size (5MB limit)
      if (fileSize > 5 * 1024 * 1024) {
        print('File too large: $fileSize bytes');
        return false;
      }

      var request = http.MultipartRequest(
        'PUT',
        Uri.parse('${ApiConfig.baseUrl}/user/profile-image'),
      );

      request.headers['Authorization'] = 'Bearer $token';

      // Determine content type based on extension
      MediaType? contentType;
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
          contentType = MediaType('image', 'jpeg');
          break;
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
          contentType = MediaType('image', 'jpeg'); // Default fallback
      }

      // Add the file with explicit content type and filename
      var multipartFile = http.MultipartFile.fromBytes(
        'profileImage',
        await imageFile.readAsBytes(),
        filename: 'profile_image.$fileExtension',
        contentType: contentType,
      );
      
      request.files.add(multipartFile);

      print('Uploading image to: ${request.url}');
      print('Headers: ${request.headers}');
      print('Content-Type: $contentType');
      print('Filename: profile_image.$fileExtension');

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      } else {
        print('Upload failed with status: ${response.statusCode}');
        print('Error response: ${response.body}');
        return false;
      }
    } catch (e) {
      print('Error updating profile image: $e');
      return false;
    }
  }

  // Change password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    try {
      final headers = await _getHeaders();
      headers['Content-Type'] = 'application/json';
      
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/user/change-password'),
        headers: headers,
        body: json.encode({
          'currentPassword': currentPassword,
          'newPassword': newPassword,
          'confirmPassword': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      print('Error changing password: $e');
      return false;
    }
  }

  // Get user statistics
  Future<Map<String, dynamic>?> getUserStats() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/user/stats'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return data['data'];
        }
      }
      return null;
    } catch (e) {
      print('Error getting user stats: $e');
      return null;
    }
  }
}