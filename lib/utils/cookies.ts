import Cookies from 'js-cookie';

export const getAuthToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get('authToken');
};

export const setAuthToken = (token: string): void => {
  Cookies.set('authToken', token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
    path: '/' // Explicitly set path
  });
};

export const removeAuthToken = (): void => {
  Cookies.remove('authToken', { path: '/' });
};

// User data helpers - cura_user is ONLY stored in localStorage, never cookies
export const setUserData = (user: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cura_user', JSON.stringify(user));
};

export const getUserData = (): any | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('cura_user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    
    // Validate user object has required fields
    if (user && user.email && user.role) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
};

export const removeUserData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cura_user');
};
