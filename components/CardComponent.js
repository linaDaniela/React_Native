import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardComponent({ title, description, icon, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color="#1976D2" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",             // Una sola columna
    flexDirection: "row",      // Layout horizontal
    alignItems: "center",      // Centrado verticalmente
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,          // Solo margen inferior
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,            // separación a la derecha del ícono
  },

  textContainer: {
    flex: 1,                    // Ocupa el espacio restante
    alignItems: "flex-start",   // alineado a la izquierda
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1976D2",
    textAlign: "left",          // alineado a la izquierda
  },

  description: {
    fontSize: 13,
    color: "#555",
    textAlign: "left",          // alineado a la izquierda
  },
});