const Ziggy = {
  url: 'http:\/\/localhost',
  port: null,
  defaults: {},
  routes: {
    login: { uri: 'login', methods: ['GET', 'HEAD'] },
    'login.store': { uri: 'login', methods: ['POST'] },
    logout: { uri: 'logout', methods: ['POST'] },
    'password.request': { uri: 'forgot-password', methods: ['GET', 'HEAD'] },
    'password.reset': {
      uri: 'reset-password\/{token}',
      methods: ['GET', 'HEAD'],
      parameters: ['token'],
    },
    'password.email': { uri: 'forgot-password', methods: ['POST'] },
    'password.update': { uri: 'reset-password', methods: ['POST'] },
    register: { uri: 'register', methods: ['GET', 'HEAD'] },
    'register.store': { uri: 'register', methods: ['POST'] },
    'user-profile-information.update': {
      uri: 'user\/profile-information',
      methods: ['PUT'],
    },
    'user-password.update': { uri: 'user\/password', methods: ['PUT'] },
    'password.confirm': {
      uri: 'user\/confirm-password',
      methods: ['GET', 'HEAD'],
    },
    'password.confirmation': {
      uri: 'user\/confirmed-password-status',
      methods: ['GET', 'HEAD'],
    },
    'password.confirm.store': {
      uri: 'user\/confirm-password',
      methods: ['POST'],
    },
    'two-factor.login': {
      uri: 'two-factor-challenge',
      methods: ['GET', 'HEAD'],
    },
    'two-factor.login.store': {
      uri: 'two-factor-challenge',
      methods: ['POST'],
    },
    'two-factor.enable': {
      uri: 'user\/two-factor-authentication',
      methods: ['POST'],
    },
    'two-factor.confirm': {
      uri: 'user\/confirmed-two-factor-authentication',
      methods: ['POST'],
    },
    'two-factor.disable': {
      uri: 'user\/two-factor-authentication',
      methods: ['DELETE'],
    },
    'two-factor.qr-code': {
      uri: 'user\/two-factor-qr-code',
      methods: ['GET', 'HEAD'],
    },
    'two-factor.secret-key': {
      uri: 'user\/two-factor-secret-key',
      methods: ['GET', 'HEAD'],
    },
    'two-factor.recovery-codes': {
      uri: 'user\/two-factor-recovery-codes',
      methods: ['GET', 'HEAD'],
    },
    'profile.show': { uri: 'user\/profile', methods: ['GET', 'HEAD'] },
    'other-browser-sessions.destroy': {
      uri: 'user\/other-browser-sessions',
      methods: ['DELETE'],
    },
    'current-user-photo.destroy': {
      uri: 'user\/profile-photo',
      methods: ['DELETE'],
    },
    'current-user.destroy': { uri: 'user', methods: ['DELETE'] },
    'teams.create': { uri: 'teams\/create', methods: ['GET', 'HEAD'] },
    'teams.store': { uri: 'teams', methods: ['POST'] },
    'teams.show': {
      uri: 'teams\/{team}',
      methods: ['GET', 'HEAD'],
      parameters: ['team'],
    },
    'teams.update': {
      uri: 'teams\/{team}',
      methods: ['PUT'],
      parameters: ['team'],
    },
    'teams.destroy': {
      uri: 'teams\/{team}',
      methods: ['DELETE'],
      parameters: ['team'],
    },
    'current-team.update': { uri: 'current-team', methods: ['PUT'] },
    'team-members.store': {
      uri: 'teams\/{team}\/members',
      methods: ['POST'],
      parameters: ['team'],
    },
    'team-members.update': {
      uri: 'teams\/{team}\/members\/{user}',
      methods: ['PUT'],
      parameters: ['team', 'user'],
    },
    'team-members.destroy': {
      uri: 'teams\/{team}\/members\/{user}',
      methods: ['DELETE'],
      parameters: ['team', 'user'],
    },
    'team-invitations.accept': {
      uri: 'team-invitations\/{invitation}',
      methods: ['GET', 'HEAD'],
      parameters: ['invitation'],
    },
    'team-invitations.destroy': {
      uri: 'team-invitations\/{invitation}',
      methods: ['DELETE'],
      parameters: ['invitation'],
    },
    'sanctum.csrf-cookie': {
      uri: 'sanctum\/csrf-cookie',
      methods: ['GET', 'HEAD'],
    },
    'livewire.update': { uri: 'livewire\/update', methods: ['POST'] },
    'livewire.upload-file': { uri: 'livewire\/upload-file', methods: ['POST'] },
    'livewire.preview-file': {
      uri: 'livewire\/preview-file\/{filename}',
      methods: ['GET', 'HEAD'],
      parameters: ['filename'],
    },
    'ignition.healthCheck': {
      uri: '_ignition\/health-check',
      methods: ['GET', 'HEAD'],
    },
    'ignition.executeSolution': {
      uri: '_ignition\/execute-solution',
      methods: ['POST'],
    },
    'ignition.updateConfig': {
      uri: '_ignition\/update-config',
      methods: ['POST'],
    },
    home: { uri: '\/', methods: ['GET', 'HEAD'] },
    dashboard: { uri: 'dashboard', methods: ['GET', 'HEAD'] },
    'profile.edit': { uri: 'profile', methods: ['GET', 'HEAD'] },
    'profile.update': { uri: 'profile', methods: ['PATCH'] },
    'profile.destroy': { uri: 'profile', methods: ['DELETE'] },
    'get.file-upload': { uri: 'file-upload', methods: ['POST'] },
    'get.upload-progress': { uri: 'upload-progress', methods: ['GET', 'HEAD'] },
    'data-dictionary': { uri: 'data-dictionary', methods: ['GET', 'HEAD'] },
    FAQ: { uri: 'faq', methods: ['GET', 'HEAD'] },
    license: { uri: 'license', methods: ['GET', 'HEAD'] },
    'privacy-policy': { uri: 'privacy-policy', methods: ['GET', 'HEAD'] },
    'terms-of-service': { uri: 'terms-of-service', methods: ['GET', 'HEAD'] },
    'read.data-dictionary': {
      uri: 'read-data-dictionary',
      methods: ['GET', 'HEAD'],
    },
    'model-results-overview': {
      uri: 'model-results-overview/{run_id}/{modelName}',
      methods: ['GET', 'HEAD'],
      parameters: ['run_id', 'modelName'],
    },
  },
};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
