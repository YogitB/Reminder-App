import { SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from '@react-navigation/native';
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  FlatList,
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
};

export default function IndexScreen() {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({ SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold });  const themedStyles = styles(colors);

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

      <TextInput
        style={themedStyles.input}
        placeholder="Enter a reminder..."
        placeholderTextColor={colors.icon}
        value={reminder}
        onChangeText={setReminder}
      />

      <TouchableOpacity style={themedStyles.button} onPress={addReminder}>
        <Text style={themedStyles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>

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
              <Text
                style={[
                  themedStyles.cardText,
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
        )}
      />
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
      fontFamily: 'Urbanist_800ExtraBold',
      marginBottom: 20,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.icon,
      padding: 12,
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: colors.card,
      color: colors.text,
      fontFamily: 'Urbanist_400Regular',
      fontSize: 16,
    },
    button: {
      backgroundColor: colors.tint,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontFamily: 'Urbanist_600SemiBold',
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
      alignItems: "center",
      gap: 10,
    },
    cardText: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'Urbanist_400Regular',
      flex: 1,
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
      fontFamily: 'Urbanist_600SemiBold',
      fontSize: 16,
    },
  });