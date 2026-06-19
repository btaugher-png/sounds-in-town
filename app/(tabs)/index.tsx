import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function Shows() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, starts_at, is_free, cover_price, bands ( name ), venues ( name, city )')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
    if (!error && data) setEvents(data)
    setLoading(false)
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return (
    <View style={styles.center}>
      <Text style={styles.loadingText}>Loading shows...</Text>
    </View>
  )

  if (events.length === 0) return (
    <View style={styles.center}>
      <Text style={styles.emptyText}>No upcoming shows yet.</Text>
      <Text style={styles.emptySubtext}>Check back soon!</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.bandName}>{item.bands?.name}</Text>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.venue}>{item.venues?.name} - {item.venues?.city}</Text>
            <View style={styles.footer}>
              <Text style={styles.date}>{formatDate(item.starts_at)}</Text>
              <Text style={styles.price}>{item.is_free ? 'Free' : '$' + item.cover_price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', padding: 16 },
  center: { flex: 1, backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', fontSize: 16 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptySubtext: { color: '#888', fontSize: 14, marginTop: 8 },
  card: { backgroundColor: '#2A2A3E', borderRadius: 12, padding: 16, marginBottom: 12 },
  bandName: { color: '#6C3FC5', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  eventTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  venue: { color: '#888', fontSize: 14, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { color: '#aaa', fontSize: 13 },
  price: { color: '#F5A623', fontWeight: 'bold', fontSize: 13 },
})
