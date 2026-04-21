import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

type Reminder = {
  id: string;
  text: string;
  completed: boolean;
};

export default function IndexScreen() {
  const [reminder, setReminder] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);

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
    if (!reminder.trim()) return;

    setReminders((prev) => [
      ...prev,
      { id: Date.now().toString(), text: reminder.trim(), completed: false },
    ]);

    setReminder("");
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const renderRightActions = (id: string) => (
    <View style={styles.deleteBox}>
      <Text style={styles.deleteText} onPress={() => deleteReminder(id)}>
        Delete
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reminders</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a reminder..."
        placeholderTextColor="#777"
        value={reminder}
        onChangeText={setReminder}
      />

      <Button title="Add Reminder" onPress={addReminder} />

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log("Rendering item:", item.text);

          return (
            <Swipeable
              overshootRight={false}
              renderRightActions={() => renderRightActions(item.id)}
            >
              <View style={styles.card}>
                <Checkbox
                  value={item.completed}
                  onValueChange={() => toggleComplete(item.id)}
                  color={item.completed ? "#4CAF50" : "#fff"}
                />
                <Text
                  style={[
                    styles.cardText,
                    item.completed && {
                      textDecorationLine: "line-through",
                      opacity: 0.5,
                    },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            </Swipeable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "black" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "white" },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#111",
    color: "white",
  },
  card: {
    backgroundColor: "#222",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardText: { color: "white", fontSize: 18, flex: 1 },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    width: 100,
  },
  deleteText: { color: "white", fontWeight: "bold", fontSize: 16 },
});