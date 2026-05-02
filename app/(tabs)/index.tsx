import { SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

type Reminder = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  notes?: string;
};

export default function IndexScreen() {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({ SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold });
  const themedStyles = styles(colors);

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("reminders");
      if (stored) setReminders(JSON.parse(stored));
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!title.trim()) return;

    setReminders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: title.trim(),
        completed: false,
        dueDate: dueDate.toLocaleDateString(),
        dueTime: dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: notes.trim(),
      },
    ]);

    // Reset form
    setTitle("");
    setNotes("");
    setDueDate(new Date());
    setDueTime(new Date());
    setModalVisible(false);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const renderRightActions = (id: string) => (
    <View style={themedStyles.deleteBox}>
      <Text style={themedStyles.deleteText} onPress={() => deleteReminder(id)}>
        Delete
      </Text>
    </View>
  );

  if (!fontsLoaded) return null;

  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>Reminders</Text>

      {/* Add Button */}
      <TouchableOpacity style={themedStyles.button} onPress={() => setModalVisible(true)}>
        <Text style={themedStyles.buttonText}>+ Add Reminder</Text>
      </TouchableOpacity>

      {/* Reminders List */}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            overshootRight={false}
            renderRightActions={() => renderRightActions(item.id)}
          >
            <View style={themedStyles.card}>
              <Checkbox
                value={item.completed}
                onValueChange={() => toggleComplete(item.id)}
                color={item.completed ? "#4CAF50" : colors.tint}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    themedStyles.cardText,
                    item.completed && { textDecorationLine: "line-through", opacity: 0.5 },
                  ]}
                >
                  {item.text}
                </Text>
                {item.dueDate ? (
                  <Text style={themedStyles.cardMeta}>📅 {item.dueDate} at {item.dueTime}</Text>
                ) : null}
                {item.notes ? (
                  <Text style={themedStyles.cardNotes}>{item.notes}</Text>
                ) : null}
              </View>
            </View>
          </Swipeable>
        )}
      />

      {/* Add Reminder Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={themedStyles.modalOverlay} onPress={() => setModalVisible(false)} />
        <View style={themedStyles.modalContent}>
          <Text style={themedStyles.modalTitle}>New Reminder</Text>

          <Text style={themedStyles.label}>Title</Text>
          <TextInput
            style={themedStyles.input}
            placeholder="e.g. Buy groceries"
            placeholderTextColor={colors.icon}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={themedStyles.label}>Due Date</Text>
          <TouchableOpacity style={themedStyles.pickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={themedStyles.pickerButtonText}>📅 {dueDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => { setShowDatePicker(false); if (date) setDueDate(date); }}
            />
          )}

          <Text style={themedStyles.label}>Time</Text>
          <TouchableOpacity style={themedStyles.pickerButton} onPress={() => setShowTimePicker(true)}>
            <Text style={themedStyles.pickerButtonText}>
              🕐 {dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={dueTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, time) => { setShowTimePicker(false); if (time) setDueTime(time); }}
            />
          )}

          <Text style={themedStyles.label}>Notes</Text>
          <TextInput
            style={[themedStyles.input, { height: 80 }]}
            placeholder="Optional notes..."
            placeholderTextColor={colors.icon}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <TouchableOpacity style={themedStyles.button} onPress={addReminder}>
            <Text style={themedStyles.buttonText}>Save Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={themedStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 60,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontFamily: 'SpaceGrotesk_700Bold',
      marginBottom: 20,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.tint,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: 'white',
      fontFamily: 'SpaceGrotesk_600SemiBold',
      fontSize: 16,
    },
    card: {
      backgroundColor: colors.card,
      padding: 15,
      marginVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.icon,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    cardText: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'SpaceGrotesk_600SemiBold',
    },
    cardMeta: {
      color: colors.icon,
      fontSize: 12,
      fontFamily: 'SpaceGrotesk_400Regular',
      marginTop: 4,
    },
    cardNotes: {
      color: colors.text,
      fontSize: 13,
      fontFamily: 'SpaceGrotesk_400Regular',
      marginTop: 4,
      opacity: 0.7,
    },
    deleteBox: {
      backgroundColor: "#FF3B30",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingHorizontal: 20,
      marginVertical: 8,
      borderRadius: 10,
      width: 100,
    },
    deleteText: {
      color: "white",
      fontFamily: 'SpaceGrotesk_600SemiBold',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: colors.card,
      padding: 24,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: 'SpaceGrotesk_700Bold',
      color: colors.text,
      marginBottom: 16,
    },
    label: {
      fontFamily: 'SpaceGrotesk_600SemiBold',
      fontSize: 14,
      color: colors.text,
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.icon,
      padding: 12,
      borderRadius: 10,
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: 'SpaceGrotesk_400Regular',
      fontSize: 15,
    },
    pickerButton: {
      borderWidth: 1,
      borderColor: colors.icon,
      padding: 12,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    pickerButtonText: {
      color: colors.text,
      fontFamily: 'SpaceGrotesk_400Regular',
      fontSize: 15,
    },
    cancelText: {
      color: colors.icon,
      fontFamily: 'SpaceGrotesk_400Regular',
      textAlign: 'center',
      marginTop: 12,
      fontSize: 15,
    },
  });