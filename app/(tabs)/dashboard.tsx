import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [band, setBand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBandForm, setShowBandForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [bandName, setBandName] = useState('')
  const [bandBio, setBandBio] = useState('')
  const [bandCity, setBandCity] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueCity, setVenueCity] = useState('')
  const [isFree, setIsFree] = useState(true)

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(profileData)
    if (profileData?.role === 'band') {
      const { data: bandData } = await supabase.from('bands').select('*').eq('owner_id', user.id).single()
      setBand(bandData)
    }
    setLoading(false)
  }

  async function createBand() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('bands').insert({ owner_id: user.id, name: bandName, bio: bandBio, city: bandCity }).select().single()
    if (error) Alert.alert('Error', error.message)
    else { setBand(data); setShowBandForm(false); Alert.alert('Success', 'Band profile created!') }
  }

  async function addEvent() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: venueData } = await supabase.from('venues').insert({ name: venueName, city: venueCity, owner_id: user.id }).select().single()
    const { error } = await supabase.from('events').insert({ band_id: band.id, venue_id: venueData?.id, title: eventTitle, starts_at: new Date(eventDate).toISOString(), is_free: isFree })
    if (error) Alert.alert('Error', error.message)
    else { setShowEventForm(false); Alert.alert('Show added!') }
  }

  if (loading) return (
    <View style={styles.center}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  )

  if (profile?.role === 'fan') return (
    <View style={styles.center}>
      <Text style={styles.title}>Fan Dashboard</Text>
      <Text style={styles.subtitle}>Follow bands to see their shows here.</Text>
    </View>
  )

  if (profile?.role === 'venue') return (
    <View style={styles.center}>
      <Text style={styles.title}>Venue Dashboard</Text>
      <Text style={styles.subtitle}>Venue management coming soon.</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Band Dashboard</Text>
      {!band ? (
        <>
          <Text style={styles.subtitle}>No band profile yet.</Text>
          {!showBandForm ? (
            <TouchableOpacity style={styles.button} onPress={() => setShowBandForm(true)}>
              <Text style={styles.buttonText}>Create Band Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Band Name" placeholderTextColor="#888" value={bandName} onChangeText={setBandName} />
              <TextInput style={styles.input} placeholder="Bio" placeholderTextColor="#888" value={bandBio} onChangeText={setBandBio} multiline />
              <TextInput style={styles.input} placeholder="City" placeholderTextColor="#888" value={bandCity} onChangeText={setBandCity} />
              <TouchableOpacity style={styles.button} onPress={createBand}>
                <Text style={styles.buttonText}>Save Band Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.bandName}>{band.name}</Text>
            <Text style={styles.meta}>{band.city}</Text>
            <Text style={styles.meta}>{band.bio}</Text>
          </View>
          {!showEventForm ? (
            <TouchableOpacity style={styles.button} onPress={() => setShowEventForm(true)}>
              <Text style={styles.buttonText}>+ Add a Show</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Event Title" placeholderTextColor="#888" value={eventTitle} onChangeText={setEventTitle} />
              <TextInput style={styles.input} placeholder="Date e.g. 2026-07-04 20:00" placeholderTextColor="#888" value={eventDate} onChangeText={setEventDate} />
              <TextInput style={styles.input} placeholder="Venue Name" placeholderTextColor="#888" value={venueName} onChangeText={setVenueName} />
              <TextInput style={styles.input} placeholder="Venue City" placeholderTextColor="#888" value={venueCity} onChangeText={setVenueCity} />
              <View style={styles.row}>
                <Text style={styles.meta}>Free show?</Text>
                <TouchableOpacity style={[styles.toggle, isFree && styles.toggleActive]} onPress={() => setIsFree(!isFree)}>
                  <Text style={styles.toggleText}>{isFree ? 'Yes' : 'No'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={addEvent}>
                <Text style={styles.buttonText}>Save Show</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEventForm(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', padding: 16 },
  center: { flex: 1, backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 24 },
  card: { backgroundColor: '#2A2A3E', borderRadius: 12, padding: 16, marginBottom: 16 },
  bandName: { color: '#6C3FC5', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  meta: { color: '#888', fontSize: 14, marginBottom: 4 },
  form: { backgroundColor: '#2A2A3E', borderRadius: 12, padding: 16, marginBottom: 16 },
  input: { backgroundColor: '#1A1A2E', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: '#444' },
  button: { backgroundColor: '#6C3FC5', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  toggle: { backgroundColor: '#444', borderRadius: 8, padding: 8, paddingHorizontal: 16 },
  toggleActive: { backgroundColor: '#6C3FC5' },
  toggleText: { color: '#fff', fontWeight: 'bold' },
  cancel: { color: '#888', textAlign: 'center', marginTop: 8 },
  loadingText: { color: '#888', fontSize: 16 },
})