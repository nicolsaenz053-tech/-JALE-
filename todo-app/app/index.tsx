/**
 * Main App Screen - Todo List Application
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { Task } from '../types';
import FilterButtons from '../components/FilterButtons';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import EmptyState from '../components/EmptyState';

export default function HomeScreen() {
  const { tasks, filteredTasks, filter, setFilter, addTask, updateTask, deleteTask, toggleTask, loading, error } = useTasks();
  const { colors, theme, toggleTheme } = useTheme();
  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleAddTask = () => {
    setEditingTask(undefined);
    setFormVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormVisible(true);
  };

  const handleSubmitTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>✓ Tasks</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {taskCounts.active} active
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Theme Toggle */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: colors.primaryLight },
              ]}
              onPress={toggleTheme}
            >
              <Text style={styles.icon}>{theme === 'light' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>

            {/* Add Task Button */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleAddTask}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View
            style={[
              styles.errorMessage,
              { backgroundColor: colors.danger + '20' },
            ]}
          >
            <Text style={[styles.errorText, { color: colors.danger }]}>
              ⚠️ {error}
            </Text>
          </View>
        )}

        {/* Filter Buttons */}
        <FilterButtons
          activeFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
          colors={colors}
        />

        {/* Task List or Empty State */}
        {filteredTasks.length === 0 ? (
          <EmptyState filter={filter} colors={colors} />
        ) : (
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
            colors={colors}
          />
        )}

        {/* Task Form Modal */}
        <TaskForm
          visible={formVisible}
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => setFormVisible(false)}
          colors={colors}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorMessage: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
