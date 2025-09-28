class User {
  final String id;
  final String username;
  final String email;
  final String profileImage;
  final String token;
  
  User({
    required this.id,
    required this.username,
    required this.email,
    required this.profileImage,
    required this.token,
  });
  
  factory User.fromJson(Map<String, dynamic> json, {String? token}) {
    return User(
      id: json['_id'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      profileImage: json['profileImage'] ?? 'default-profile.png',
      token: token ?? '',
    );
  }
}