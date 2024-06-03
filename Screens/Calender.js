import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../lib/supabase.js';

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

const CalendarScreen = ({ navigation }) => {
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
    fetchUserRole();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const { data } = await supabase.from('events').select('*').like('date', `${year}-${month.toString().padStart(2, '0')}-%`);
    const formattedEvents = {};
    data.forEach(event => {
      if (!formattedEvents[event.date]) {
        formattedEvents[event.date] = [];
      }
      formattedEvents[event.date].push({
        id: event.id,
        name: event.title,
        startTime: event.start_time,
        endTime: event.end_time
      });
    });
    setEvents(formattedEvents);
  };

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setUserRole(data.role);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    if (userRole === 'admin') {
      setModalVisible(true);
    }
  };

  const handleSaveEvent = async () => {
    const newEvent = {
      date: selectedDate,
      title: eventTitle,
      start_time: startTime,
      end_time: endTime
    };

    await supabase.from('events').insert([newEvent]);
    setModalVisible(false);
    setEventTitle('');
    setStartTime('');
    setEndTime('');
    fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    await supabase.from('events').delete().eq('id', id);
    fetchEvents(); 
  };

  const renderRightActions = (progress, dragX, id) => {
    return (
      <TouchableOpacity onPress={() => handleDeleteEvent(id)}>
        <View style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const sortedEvents = Object.keys(events)
    .sort((a, b) => new Date(a) - new Date(b))
    .reduce((acc, date) => {
      acc[date] = events[date].sort((a, b) => new Date(`1970-01-01T${a.startTime}`) - new Date(`1970-01-01T${b.startTime}`));
      return acc;
    }, {});

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Calendar
          current={currentDate}
          onDayPress={handleDayPress}
          markedDates={Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true };
            return acc;
          }, {})}
          onMonthChange={(month) => setCurrentDate(new Date(month.dateString))}
        />
        <ScrollView>
          {Object.keys(sortedEvents).map(date => (
            <View key={date} style={styles.eventItemContainer}>
              <Text style={styles.eventDate}>{date}</Text>
              {sortedEvents[date].map(event => (
                <Swipeable
                  key={event.id}
                  renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, event.id)}
                >
                  <View style={styles.eventItem}>
                    <Text style={styles.eventText}>{event.name}</Text>
                    <Text style={styles.eventTime}>{event.startTime} - {event.endTime}</Text>
                  </View>
                </Swipeable>
              ))}
            </View>
          ))}
        </ScrollView>
        {userRole === 'admin' && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>Create New Event</Text>
                <TextInput
                  placeholder="Event Title"
                  placeholderTextColor="#888"
                  value={eventTitle}
                  onChangeText={setEventTitle}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Start Time (e.g., 6:00 PM)"
                  placeholderTextColor="#888"
                  value={startTime}
                  onChangeText={setStartTime}
                  style={styles.input}
                />
                <TextInput
                  placeholder="End Time (e.g., 9:00 PM)"
                  placeholderTextColor="#888"
                  value={endTime}
                  onChangeText={setEndTime}
                  style={styles.input}
                />
                <Button title="Save Changes" onPress={handleSaveEvent} />
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  eventItemContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventItem: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
  },
  eventTime: {
    color: '#fff',
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: 200,
    paddingLeft: 8,
    color: '#000', 
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;