const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  return response.json();
};

const fetchWithTokenRefresh = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        });
      }

      isRefreshing = true;

      try {
        await refreshAccessToken();
        isRefreshing = false;
        processQueue(null);

        // Retry original request
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const api = {
  async signup(data) {
    const response = await fetchWithTokenRefresh(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(data) {
    const response = await fetchWithTokenRefresh(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetchWithTokenRefresh(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  async getProfile() {
    const response = await fetchWithTokenRefresh(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  async updateProfile(data) {
    const response = await fetchWithTokenRefresh(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async refreshToken() {
    return refreshAccessToken();
  },
};

