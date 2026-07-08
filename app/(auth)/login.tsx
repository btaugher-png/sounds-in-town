import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function signIn() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      router.replace('/(tabs)')
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sounds in Town</Text>
      <Text style={styles.subtitle}>Find live music near you</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <View style={styles.passwordContainer}>
        <TextInput style={styles.passwordInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
          <Text style={styles.eyeText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={signIn} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#1A1A2E' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#6C3FC5', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 48 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  passwordContainer: { flexDirection: 'row', backgroundColor: 'red', borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  passwordInput: { flex: 1, padding: 14, fontSize: 16 },
  eyeButton: { paddingHorizontal: 16, paddingVertical: 14, justifyContent: 'center' },
  eyeText: { color: '#6C3FC5', fontWeight: 'bold', fontSize: 13 },
  button: { backgroundColor: '#6C3FC5', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#6C3FC5', textAlign: 'center', marginTop: 24 },
})