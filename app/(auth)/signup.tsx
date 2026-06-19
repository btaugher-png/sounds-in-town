import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('fan')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signUp() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, display_name: displayName } }
    })
    if (error) Alert.alert('Error', error.message)
    else Alert.alert('Success', 'Account created! You can now sign in.')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Text style={styles.label}>I am a...</Text>
      <View style={styles.roleRow}>
        {['fan', 'band', 'venue'].map(r => (
          <TouchableOpacity key={r} style={[styles.roleButton, role === r && styles.roleButtonActive]} onPress={() => setRole(r)}>
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={signUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#1A1A2E' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#6C3FC5', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, fontSize: 16 },
  label: { color: '#888', marginBottom: 8, marginTop: 8 },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  roleButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#6C3FC5', alignItems: 'center' },
  roleButtonActive: { backgroundColor: '#6C3FC5' },
  roleText: { color: '#6C3FC5', fontWeight: 'bold' },
  roleTextActive: { color: '#fff' },
  button: { backgroundColor: '#6C3FC5', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#6C3FC5', textAlign: 'center', marginTop: 24 },
})
