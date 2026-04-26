import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getTasks, updateTaskStatus, deleteTask } from '../services/api';
import { getUserData, clearUserData } from '../utils/auth';

const TasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { user } = await getUserData();
    if (user) {
      setUserRole(user.role);
      setUserName(user.name);
    }
    await fetchTasks();
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await updateTaskStatus(taskId, newStatus);
      await fetchTasks();
      Alert.alert('Success', `Task marked as ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update');
    }
  };

  // FIXED DELETE FUNCTION - No Alert nesting issues
  const confirmDelete = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => performDelete(taskId),
          style: 'destructive' 
        }
      ]
    );
  };

  const performDelete = async (taskId) => {
    try {
      setLoading(true);
      const response = await deleteTask(taskId);
      console.log('Delete response:', response);
      await fetchTasks();
      Alert.alert('Success', 'Task deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  // FIXED LOGOUT FUNCTION - Force page reload
  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => performLogout(),
          style: 'destructive' 
        }
      ]
    );
  };

  const performLogout = async () => {
    try {
      await clearUserData();
      // Force page reload for web
      if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    return { total, completed, pending };
  };

  const stats = getStats();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.welcomeText}>Hello, {userName}!</Text>
        </View>
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#667eea' }]}>
          <Text style={styles.statNum}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#48c78e' }]}>
          <Text style={styles.statNum}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#e67e22' }]}>
          <Text style={styles.statNum}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}>
          <Text style={filter === 'all' ? styles.activeFilterText : styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'pending' && styles.activeFilter]}
          onPress={() => setFilter('pending')}>
          <Text style={filter === 'pending' ? styles.activeFilterText : styles.filterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}>
          <Text style={filter === 'completed' ? styles.activeFilterText : styles.filterText}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Create Task Button - Admin Only */}
      {userRole === 'admin' && (
        <TouchableOpacity 
          style={styles.createTaskBtn}
          onPress={() => navigation.navigate('CreateTask')}>
          <Text style={styles.createTaskText}>+ Create New Task</Text>
        </TouchableOpacity>
      )}

      {/* Task List */}
      <FlatList
        data={getFilteredTasks()}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDesc}>{item.description}</Text>
            <Text style={styles.taskStatus}>Status: {item.status}</Text>
            <Text style={styles.taskUser}>Assigned to: {item.assignedTo?.name || 'Unknown'}</Text>
            
            <View style={styles.taskActions}>
              {item.status !== 'completed' && (
                <TouchableOpacity 
                  style={styles.completeBtn}
                  onPress={() => handleStatusUpdate(item._id, item.status)}>
                  <Text style={styles.actionBtnText}>✓ Complete</Text>
                </TouchableOpacity>
              )}
              {userRole === 'admin' && (
                <TouchableOpacity 
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(item._id)}>
                  <Text style={styles.actionBtnText}>🗑 Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubtext}>
              {userRole === 'admin' ? 'Click + to create a task' : 'You have no tasks assigned'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#667eea', 
    padding: 20, 
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  welcomeText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', padding: 15, marginTop: -20, gap: 10 },
  statBox: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#fff', marginTop: 5 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 15, gap: 10 },
  filterBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  activeFilter: { backgroundColor: '#667eea', borderColor: '#667eea' },
  filterText: { color: '#666', fontWeight: '600' },
  activeFilterText: { color: '#fff', fontWeight: '600' },
  createTaskBtn: { backgroundColor: '#48c78e', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 12, alignItems: 'center', elevation: 3 },
  createTaskText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  taskCard: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 12, padding: 16, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  taskDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  taskStatus: { fontSize: 12, color: '#667eea', marginBottom: 4 },
  taskUser: { fontSize: 12, color: '#999', marginBottom: 12 },
  taskActions: { flexDirection: 'row', gap: 10 },
  completeBtn: { backgroundColor: '#48c78e', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#e74c3c', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  empty: { alignItems: 'center', padding: 50 },
  emptyText: { fontSize: 18, color: '#999', marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: '#bbb', textAlign: 'center' },
});

export default TasksScreen;