import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Ensure Pusher is accessible globally for Laravel Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo<any> | null = null;

export const getEcho = (): Echo<any> | null => {
  if (typeof window === 'undefined') return null;

  if (echoInstance) return echoInstance;

  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'weddingclickkey';
  const configuredHost = process.env.NEXT_PUBLIC_REVERB_HOST;
  const browserHost = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
  const host = configuredHost && configuredHost !== '127.0.0.1' && configuredHost !== 'localhost'
    ? configuredHost 
    : browserHost;
  const port = process.env.NEXT_PUBLIC_REVERB_PORT || '8080';
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http';

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: key,
    wsHost: host,
    wsPort: parseInt(port),
    wssPort: parseInt(port),
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  return echoInstance;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
