import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple storage keys
const TOKEN_KEY = 'task_manager_token';
const USER_KEY = 'task_manager_user';

export const storeUserData = async (token, user) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('✅ Data saved');
    return true;
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const userStr = await AsyncStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch (error) {
    console.error('Get error:', error);
    return { token: null, user: null };
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    console.log('✅ Data cleared');
    return true;
  } catch (error) {
    console.error('Clear error:', error);
    return false;
  }
};

export const isAuthenticated = async () => {
  const { token } = await getUserData();
  return !!token;
};