const isDevEnvironment = process.env.NODE_ENV !== 'production';

export const API_URL = isDevEnvironment ? 'http://localhost:3000' : 'http://localhost:3000';
