import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { supabase } from '../../lib/supabase'

type Profile = {
  display_name: string
  role: string
  city: string | null
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('display_name, role, city')
      .eq('id', user.id)
      .single()

    if (data) setProfile(data)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{profile?.display_name || 'Your Profile'}</Text>
        <Text style={styles.role}>{profile?.role?.toUpperCase()}</Text>
        {profile?.city && <Text style={styles.city}>{profile.city}</Text>}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', padding: 24 },
  card: { backgroundColor: '#2A2A3E', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 24 },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  role: { color: '#6C3FC5', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  city: { color: '#888', fontSize: 14 },
  signOutButton: { backgroundColor: '#2A2A3E', borderRadius: 8, padding: 16, alignItems: 'center' },
  signOutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 },
})