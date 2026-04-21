import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal-Screen we have to lock in</Text>
      <Text style={styles.text}>This is a modal screen mean for deven.</Text>
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
