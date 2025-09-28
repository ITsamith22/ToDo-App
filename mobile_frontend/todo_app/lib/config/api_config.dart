import 'environment.dart';

class ApiConfig {
  static String get baseUrl => EnvironmentConfig.baseUrl;

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';

  // Todo endpoints
  static const String todos = '/todos';

  // User endpoints
  static const String profile = '/user/profile';
}
