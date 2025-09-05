'use client';

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode,
    useMemo,
    useCallback,
} from 'react';
import { User, LoginCredentials, RegisterData, UserRole } from '@/lib/types';

// Define AuthState interface here to include the error property
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/utils/cookies';

// Auth Actions
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGIN_FAILURE'; payload?: string }
    | { type: 'LOGOUT' }
    | { type: 'REGISTER_START' }
    | { type: 'REGISTER_SUCCESS'; payload: User }
    | { type: 'REGISTER_FAILURE'; payload?: string }
    | { type: 'LOAD_USER_START' }
    | { type: 'LOAD_USER_SUCCESS'; payload: User }
    | { type: 'LOAD_USER_FAILURE' };

// Auth Context Type
interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
    loadUser: () => Promise<void>;
    updateProfile:any;
    getCurrentUser:any;
    error: string | null;
}

// Initial State
const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
        case 'LOAD_USER_START':
            return { ...state, isLoading: true, error: null };

        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
        case 'LOAD_USER_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            };

        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: action.payload || 'An error occurred',
            };

        case 'LOAD_USER_FAILURE':
            return {
                ...state,
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null, // Don't show error for failed token validation
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: null,
            };

        default:
            return state;
    }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API helper function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    
    console.log('API Call Debug:', {
        endpoint,
        baseURL: API_BASE_URL,
        fullURL: `${API_BASE_URL}${endpoint}`,
        hasToken: !!token,
        token: token ? `${token.substring(0, 10)}...` : 'none'
    });
    
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        console.log('API Response Debug:', {
            status: response.status,
            ok: response.ok,
            url: response.url,
            data: data
        });

        if (!response) {
            // Handle specific authentication errors
            if (response.status === 401) {
                console.log('API Call: Authentication failed (401), clearing auth data');
                removeAuthToken();
                localStorage.removeItem('cura_user');
            }
            throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('API Call Failed:', {
            endpoint,
            error: errorMessage,
            fullURL: `${API_BASE_URL}${endpoint}`
        });
        throw error instanceof Error ? error : new Error(errorMessage);
    }
};


// Check if we should use mock data (for development)
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from token on mount
    const loadUser = useCallback(async () => {
        console.log('AuthContext: Starting loadUser process');
        
        // First check for auth token in cookies
        const token = getAuthToken();
        console.log('AuthContext: Token found:', !!token);

        try {
            dispatch({ type: 'LOAD_USER_START' });

            // If we have a token, fetch user data from API
            console.log('AuthContext: Validating token with backend');
            const response = await apiCall('/auth/me');
            console.log('AuthContext: Response from API:', response);
            // Store user in localStorage ONLY (no cookies for cura_user)
            localStorage.setItem('cura_user', JSON.stringify(response.data.user));

            console.log('AuthContext: Token validated successfully, user loaded');
            dispatch({ type: 'LOAD_USER_SUCCESS', payload: response.data.user });
        } catch (error) {
            console.error('AuthContext: Token validation failed:', error);
            
            // Clear invalid token and user data
            removeAuthToken();
            localStorage.removeItem('cura_user');
            
            dispatch({ type: 'LOAD_USER_FAILURE' });
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Memoized login function
    const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            console.log('AuthContext: Login successful:', response);
            
            // Store token in cookies
            setAuthToken(response.data.token);
            
            // Store user data in localStorage ONLY (no cookies for cura_user)
            localStorage.setItem('cura_user', JSON.stringify(response.data.user));
            
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
            return { success: true };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    }, []);

    // Memoized register function
    const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        dispatch({ type: 'REGISTER_START' });
        try {
            console.log('making user',data)

            const response = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            console.log(response)
            
            // Store token in cookies
            setAuthToken(response.data.token);
            
            // Store user data in localStorage ONLY (no cookies for cura_user)
            localStorage.setItem('cura_user', JSON.stringify(response.data.user));

            dispatch({ type: 'REGISTER_SUCCESS', payload: response.data.user });
            return { success: true };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    }, []);

    // Memoized logout function
    const logout = useCallback(() => {
        console.log('AuthContext: Starting logout process');

        // Clear auth token from cookies
        removeAuthToken();
        
        // Clear user data from localStorage
        localStorage.removeItem('cura_user');

        // Clear all possible auth-related localStorage items
        const authKeys = [
            'userRole',
            'userData',
            'pharmacyData',
            'accessToken',
            'refreshToken',
            'authToken', // For backward compatibility
        ];

        authKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        // Clear sessionStorage
        sessionStorage.clear();

        // cura_user is only in localStorage, no cookies to clear

        console.log('AuthContext: All storage and cookies cleared');

        // Dispatch logout action
        dispatch({ type: 'LOGOUT' });

        console.log('AuthContext: Logout action dispatched');

        // Force redirect to login page
        window.location.href = '/auth/login';
    }, []);

    // update the user information
    const updateProfile = useCallback(async (profileData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await apiCall('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });

            // Update user data in state and local storage
            const updatedUser = { ...state.user, ...profileData, ...response.user };
            localStorage.setItem('cura_user', JSON.stringify(updatedUser));
            dispatch({ type: 'LOAD_USER_SUCCESS', payload: updatedUser as User });
            
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
            console.error('Failed to update profile:', errorMessage);
            return { success: false, error: errorMessage };
        }
    }, [state.user]);
    // get current user
    const getCurrentUser = useCallback(async (): Promise<User | null> => {
        try {
            // First check if we already have the user in state
            if (state.isAuthenticated && state.user) {
                return state.user;
            }

            // Then check if we have a token
                        const token = getAuthToken();
            if (!token) {
                // If no token in cookies, check localStorage for user data
                const localStorageUser = localStorage.getItem('cura_user');
                if (localStorageUser) {
                    try {
                        const user = JSON.parse(localStorageUser);
                        dispatch({ type: 'LOAD_USER_SUCCESS', payload: user });
                        return user;
                    } catch (e) {
                        console.error('Failed to parse user from localStorage:', e);
                    }
                }
                return null;
            }

            // If we have a token but no user, fetch from API
            const response = await apiCall('/auth/me');
            console.log('AuthContext: Response from API:', response);
            // Update state and localStorage ONLY (no cookies for cura_user)
            localStorage.setItem('cura_user', JSON.stringify(response.data.user));
            
            dispatch({ type: 'LOAD_USER_SUCCESS', payload: response.data.user });

            return response.user;
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            // Clear invalid token
            removeAuthToken();
            localStorage.removeItem('cura_user');
            return null;
        }
    }, [state.isAuthenticated, state.user]);
    // Memoized switch role function (for development)
    const switchRole = useCallback(
        async (role: UserRole) => {
            if (!state.user) return;

            try {
                                                                            if (USE_MOCK_DATA) {
                    // Mock implementation
                    const updatedUser = { ...state.user, role };
                    localStorage.setItem('cura_user', JSON.stringify(updatedUser));

                    dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
                    return;
                }

                const response = await apiCall('/users/switch-role', {
                    method: 'POST',
                    body: JSON.stringify({ role }),
                });

                                            const updatedUser = response.user;
                localStorage.setItem('cura_user', JSON.stringify(updatedUser));
                // Make sure the auth token is also updated in cookies if role changes
                const token = getAuthToken();
                if (token) {
                    setAuthToken(token);
                }

                dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
            } catch (error) {
                console.error('Failed to switch role:', error);
            }
        },
        [state.user],
    );

    // Memoize context value to prevent unnecessary re-renders
    const value: AuthContextType = useMemo(
        () => ({
            ...state,
            login,
            register,
            logout,
            switchRole,
            loadUser,
            updateProfile,
            getCurrentUser,
            error: state.error,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state, login, register, logout, switchRole, loadUser],
    );

    return (
        <AuthContext.Provider value={value} data-oid="171_90a">
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper function to get dashboard route for user role
export function getDashboardRoute(role: UserRole): string {
    switch (role) {
        case 'customer':
            return '/'; // Redirect customers to homepage
        case 'admin':
            return '/admin/dashboard';
        case 'pharmacy':
            return '/pharmacy/dashboard';
        case 'prescription-reader':
            return '/prescription-reader/queue'; // Redirect directly to prescription queue
        case 'doctor':
            return '/doctor/referrals'; // Redirect doctors to referrals page
        case 'vendor':
            return '/vendor/dashboard';
        case 'database-input':
            return '/database-input/dashboard';
        case 'app-services':
            return '/app-services/dashboard'; // App Services dashboard
        default:
            return '/'; // Default to homepage for customer accounts
    }
}

// API utility functions for use in components
export const authAPI = {
    // Update user profile
    updateProfile: async (profileData: Partial<User>) => {
        return await apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    // Upload profile image
    uploadProfileImage: async (file: File) => {
        const formData = new FormData();
        formData.append('profileImage', file);

        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/users/upload-profile-image`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        const data = await response.json();
        if (!response) {
            throw new Error(data.message || 'Upload failed');
        }

        return data;
    },

    // Get user credits (for customers)
    getCredits: async () => {
        return await apiCall('/users/credits');
    },

    // Get doctor referrals (for doctors)
    getDoctorReferrals: async () => {
        return await apiCall('/users/doctor-referrals');
    },

    // Get pharmacies (for app-services)
    getPharmacies: async () => {
        return await apiCall('/users/pharmacies');
    },

    // Search users (for app-services)
    searchUsers: async (search?: string, role?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        
        return await apiCall(`/users/app-services/users?${params.toString()}`);
    },
};