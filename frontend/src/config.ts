export const WS_BACKEND_URL = 
  import.meta.env.VITE_WS_BACKEND_URL || 'ws://localhost:7001/ws/generate';

export const HTTP_BACKEND_URL = 
  import.meta.env.VITE_HTTP_BACKEND_URL || 'http://localhost:7001/api/generate';

export const DEFAULT_MODEL = 'gemma-4';
