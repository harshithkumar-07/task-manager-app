import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

const TaskCard = ({ task, userRole, onStatusUpdate, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#48c78e';
      case 'in-progress':
        return '#e67e22';
      default:
        return '#e74c3c';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Animated.View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
        </View>
      </View>

      <Text style={styles.description}>{task.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <Text style={styles.userLabel}>Assigned to:</Text>
          <Text style={styles.userName}>{task.assignedTo?.name || 'Unknown'}</Text>
        </View>

        <View style={styles.actions}>
          {userRole === 'admin' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(task._id)}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          )}

          {task.status !== 'completed' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => onStatusUpdate(task._id, task.status)}
            >
              <Text style={styles.actionText}>Complete</Text>
            </TouchableOpacity>
          )}

          {task.status === 'completed' && userRole !== 'admin' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.pendingButton]}
              onPress={() => onStatusUpdate(task._id, task.status)}
            >
              <Text style={styles.actionText}>Reopen</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLabel: {
    fontSize: 12,
    color: '#999',
    marginRight: 5,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#48c78e',
  },
  pendingButton: {
    backgroundColor: '#e67e22',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TaskCard;