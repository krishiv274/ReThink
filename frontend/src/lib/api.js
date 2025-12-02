const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

export const api = {
  async signup(data) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(data) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  // Profile CRUD operations
  async fetchProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  async updateProfile(data) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },

  async getPublicProfile(userId) {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async deleteAccount() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return handleResponse(response);
  },
};

