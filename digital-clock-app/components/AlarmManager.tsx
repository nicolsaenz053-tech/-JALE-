/**
 * Alarm Manager Component - UI completa para gestionar alarmas
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alarm, DayOfWeek } from '../types';

interface AlarmManagerProps {
  visible: boolean;
  alarms: Alarm[];
  onAdd: (alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onCancel: () => void;
  colors: any;
}

const DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const AlarmManager: React.FC<AlarmManagerProps> = ({
  visible,
  alarms,
  onAdd,
  onDelete,
  onToggle,
  onCancel,
  colors,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formData, setFormData] = useState({
    time: '07:00',
    timezone: 'UTC',
    label: '',
    sound: 'default',
    repeatDays: [] as DayOfWeek[],
  });

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const hours = String(selectedTime.getHours()).padStart(2, '0');
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      setFormData({ ...formData, time: `${hours}:${minutes}` });
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setFormData((prev) => ({
      ...prev,
      repeatDays: prev.repeatDays.includes(day)
        ? prev.repeatDays.filter((d) => d !== day)
        : [...prev.repeatDays, day],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.label.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la alarma');
      return;
    }

    try {
      await onAdd({
        time: formData.time,
        timezone: formData.timezone,
        label: formData.label,
        sound: formData.sound,
        repeatDays: formData.repeatDays.length > 0 ? formData.repeatDays : DAYS,
        enabled: true,
      });

      setFormData({
        time: '07:00',
        timezone: 'UTC',
        label: '',
        sound: 'default',
        repeatDays: [],
      });
      setShowForm(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la alarma');
    }
  };

  const handleDelete = (id: string, label: string) => {
    Alert.alert(
      'Eliminar Alarma',
      `¿Estás seguro de que quieres eliminar "${label}"?`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await onDelete(id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la alarma');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onCancel}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.headerButton, { color: colors.primary }]}>
              Cerrar
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🔔 Alarmas
          </Text>
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Add Alarm Form */}
          {showForm && (
            <View
              style={[
                styles.formContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.formTitle, { color: colors.text }]}>
                Nueva Alarma
              </Text>

              {/* Time Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Hora
                </Text>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={[styles.timeText, { color: colors.text }]}>
                    ⏰ {formData.time}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Label Input */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Nombre
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="ej: Despertar"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.label}
                  onChangeText={(text) =>
                    setFormData({ ...formData, label: text })
                  }
                />
              </View>

              {/* Repeat Days */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Repetir
                </Text>
                <View style={styles.daysGrid}>
                  {DAYS.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        {
                          backgroundColor: formData.repeatDays.includes(day)
                            ? colors.primary
                            : colors.background,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => toggleDay(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: formData.repeatDays.includes(day)
                              ? '#FFFFFF'
                              : colors.text,
                            fontWeight: formData.repeatDays.includes(day)
                              ? '700'
                              : '400',
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                  onPress={() => setShowForm(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Crear Alarma</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Alarms List */}
          {alarms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay alarmas configuradas
              </Text>
              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.emptyButtonText}>Crear Alarma</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.alarmsList}>
              {alarms.map((alarm) => (
                <AlarmItem
                  key={alarm.id}
                  alarm={alarm}
                  onToggle={() => onToggle(alarm.id)}
                  onDelete={() => handleDelete(alarm.id, alarm.label)}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={new Date(`2000-01-01 ${formData.time}`)}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

/**
 * Individual Alarm Item Component
 */
interface AlarmItemProps {
  alarm: Alarm;
  onToggle: () => void;
  onDelete: () => void;
  colors: any;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onToggle, onDelete, colors }) => {
  return (
    <View
      style={[
        styles.alarmItem,
        {
          backgroundColor: colors.surface,
          borderColor: alarm.enabled ? colors.primary : colors.border,
          borderLeftColor: alarm.enabled ? colors.success : colors.border,
        },
      ]}
    >
      <View style={styles.alarmContent}>
        <View style={styles.alarmHeader}>
          <Text
            style={[
              styles.alarmTime,
              {
                color: alarm.enabled ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            ⏰ {alarm.time}
          </Text>
          <Switch
            value={alarm.enabled}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.success }}
            thumbColor={alarm.enabled ? colors.primary : colors.textSecondary}
          />
        </View>

        <Text style={[styles.alarmLabel, { color: colors.text }]}>
          {alarm.label}
        </Text>

        <View style={styles.alarmMeta}>
          <Text style={[styles.alarmMetaText, { color: colors.textSecondary }]}>
            📍 {alarm.timezone}
          </Text>
          <Text style={[styles.alarmMetaText, { color: colors.textSecondary }]}>
            🔊 {alarm.sound}
          </Text>
        </View>

        <View style={styles.daysContainer}>
          {alarm.repeatDays.map((day) => (
            <View
              key={day}
              style={[
                styles.dayTag,
                {
                  backgroundColor: alarm.enabled ? colors.primaryLight : colors.background,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayTagText,
                  {
                    color: alarm.enabled ? colors.primary : colors.textSecondary,
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={[styles.deleteIcon, { color: colors.danger }]}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  timeButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  alarmsList: {
    gap: 12,
  },
  alarmItem: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alarmContent: {
    flex: 1,
    marginRight: 12,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alarmTime: {
    fontSize: 18,
    fontWeight: '700',
  },
  alarmLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  alarmMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  alarmMetaText: {
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dayTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
});

export default AlarmManager;
