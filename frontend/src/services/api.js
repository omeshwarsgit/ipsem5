import axios from 'axios';

// Base API URL with fallback
const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Seed default users for instant 1-click login switching
export const DEMO_USERS = {
  customer: {
    id: 1,
    name: "Alexander Sterling",
    email: "customer@apexgarage.com",
    role: "CUSTOMER",
    phone: "+1 (555) 782-4910",
  },
  mechanic: {
    id: 2,
    name: "Marcus Vance (Master Tech)",
    email: "mechanic@apexgarage.com",
    role: "MECHANIC",
    phone: "+1 (555) 349-8812",
  },
  admin: {
    id: 3,
    name: "Victoria Chen (Garage Director)",
    email: "admin@apexgarage.com",
    role: "ADMIN",
    phone: "+1 (555) 902-1100",
  }
};

// API Services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('apex_token', response.data.token);
        localStorage.setItem('apex_user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      console.warn('Backend login fallback used', err);
      // Fallback for seamless demo
      const user = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase()) || DEMO_USERS.customer;
      const demoData = { ...user, token: "demo-jwt-token" };
      localStorage.setItem('apex_token', demoData.token);
      localStorage.setItem('apex_user', JSON.stringify(demoData));
      return demoData;
    }
  },

  register: async (data) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('apex_token', response.data.token);
        localStorage.setItem('apex_user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      console.warn('Backend register fallback', err);
      const demoData = { ...data, id: Date.now(), token: "demo-jwt-token" };
      localStorage.setItem('apex_token', demoData.token);
      localStorage.setItem('apex_user', JSON.stringify(demoData));
      return demoData;
    }
  },

  getCurrentUser: () => {
    const cached = localStorage.getItem('apex_user');
    return cached ? JSON.parse(cached) : DEMO_USERS.customer;
  },

  logout: () => {
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
  }
};

export const vehicleService = {
  getByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/vehicles/user/${userId}`);
      return response.data;
    } catch (err) {
      console.warn('Fallback vehicles loaded', err);
      return [
        { id: 1, make: "Porsche", model: "911 GT3 Touring", year: 2024, licensePlate: "APX-GT302" },
        { id: 2, make: "BMW", model: "M3 Competition xDrive", year: 2023, licensePlate: "APX-M301" },
        { id: 3, make: "Audi", model: "RS6 Avant Quattro", year: 2023, licensePlate: "APX-RS603" },
      ];
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get('/vehicles');
      return response.data;
    } catch (err) {
      return [
        { id: 1, make: "Porsche", model: "911 GT3 Touring", year: 2024, licensePlate: "APX-GT302" },
        { id: 2, make: "BMW", model: "M3 Competition xDrive", year: 2023, licensePlate: "APX-M301" },
        { id: 3, make: "Audi", model: "RS6 Avant Quattro", year: 2023, licensePlate: "APX-RS603" },
      ];
    }
  },

  addVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post('/vehicles', vehicleData);
      return response.data;
    } catch (err) {
      console.warn('Add vehicle fallback', err);
      return { id: Date.now(), ...vehicleData };
    }
  },

  deleteVehicle: async (id) => {
    try {
      await apiClient.delete(`/vehicles/${id}`);
      return true;
    } catch (err) {
      console.warn('Delete vehicle fallback', err);
      return true;
    }
  }
};

export const bookingService = {
  getByCustomer: async (customerId) => {
    try {
      const response = await apiClient.get(`/bookings/customer/${customerId}`);
      return response.data;
    } catch (err) {
      console.warn('Fallback customer bookings loaded', err);
      return [];
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (err) {
      console.warn('Fallback all bookings loaded', err);
      return [];
    }
  },

  getById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (err) {
      console.warn('Create booking fallback', err);
      return { id: Date.now(), ...bookingData, status: 'CONFIRMED', createdAt: new Date().toISOString() };
    }
  },

  updateStatus: async (id, status, notes) => {
    const response = await apiClient.patch(`/bookings/${id}/status`, { status, notes });
    return response.data;
  }
};

export const billingService = {
  getByBooking: async (bookingId) => {
    const response = await apiClient.get(`/bills/booking/${bookingId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/bills/${id}`);
    return response.data;
  },

  create: async (billData) => {
    const response = await apiClient.post('/bills', billData);
    return response.data;
  },

  pay: async (id) => {
    const response = await apiClient.patch(`/bills/${id}/pay`);
    return response.data;
  }
};
