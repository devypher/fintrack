const domains = {
  DEV: {
    frontend: 'http://localhost:3000',
    backend: 'http://localhost:5002',
  },

  // Domains for staging and prod TBA
};

export const FRONTEND_URL = domains[process.env.NODE_ENV].frontend;
export const BACKEND_URL = domains[process.env.NODE_ENV].backend;
export const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  BACKEND_URL,
  'https://accounts.google.com',
];
