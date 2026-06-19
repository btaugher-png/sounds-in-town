import { View, Text, StyleSheet } from 'react-native'

export default function Map() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
})
