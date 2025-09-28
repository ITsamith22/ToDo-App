enum Environment { development, staging, production }

class EnvironmentConfig {
  static Environment _current = Environment.production;

  static Environment get current => _current;

  static String get baseUrl {
    switch (_current) {
      case Environment.development:
        return 'http://192.168.8.178:5000/api'; // Local development
      case Environment.staging:
        return 'https://mern-todo-api-tfsa.onrender.com/api'; // Staging
      case Environment.production:
        return 'https://mern-todo-api-tfsa.onrender.com/api'; // Production
    }
  }

  static void setEnvironment(Environment env) {
    _current = env;
  }
}
