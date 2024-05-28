import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import { supabase } from '../lib/supabase.js';

const DormJob = ({ id, name, assignedTo, onDelete, userRole }) => {
  return (
    <View style={styles.jobItem}>
      <Text style={styles.jobName}>{name}</Text>
      <Text style={styles.jobAssignedTo}>Assigned to: {assignedTo}</Text>
      {userRole === 'admin' && (
        <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const AddJobModal = ({ visible, onClose, onSubmit }) => {
  const [jobName, setJobName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleAddJob = () => {
    if (jobName.trim() && assignedTo.trim()) {
      onSubmit({ name: jobName, assignedTo });
      setJobName('');
      setAssignedTo('');
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Dorm Job Name"
            style={styles.modalInput}
            value={jobName}
            onChangeText={setJobName}
          />
          <TextInput
            placeholder="Assigned To"
            style={styles.modalInput}
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
          <Button title="Add Job" onPress={handleAddJob} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const DormJobsListScreen = ({ route }) => {
  const { dorm } = route.params;
  const [dormJobs, setDormJobs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userRole, setUserRole] = useState('');

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('dorm_jobs').select('*').eq('dorm', dorm);
    if (error) {
      console.error('Error fetching dorm jobs:', error);
    } else {
      setDormJobs(data || []);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching user role:', error);
        } else {
          setUserRole(data.role);
        }
      }
    };

    fetchJobs();
    fetchUserRole();
  }, [dorm]);

  const handleAddJobSubmit = async (job) => {
    const { data, error } = await supabase.from('dorm_jobs').insert([{ name: job.name, assignedTo: job.assignedTo, dorm }]);
    if (error) {
      console.error('Error adding dorm job:', error.message);
    } else {
      fetchJobs(); // Refetch items to ensure the new job is displayed
    }
  };

  const handleDeleteJob = async (id) => {
    const { error } = await supabase.from('dorm_jobs').delete().eq('id', id);
    if (error) {
      console.error(`Error deleting dorm job with ID ${id}:`, error);
    } else {
      fetchJobs(); // Refetch items to ensure the deleted job is removed
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dorm Jobs</Text>
      <ScrollView style={styles.scrollView}>
        {dormJobs.map((job, index) => (
          <DormJob
            key={job.id || index}
            id={job.id}
            name={job.name}
            assignedTo={job.assignedTo}
            onDelete={handleDeleteJob}
            userRole={userRole}
          />
        ))}
      </ScrollView>
      {userRole === 'admin' && (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
      <AddJobModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddJobSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  jobItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobName: {
    fontSize: 18,
  },
  jobAssignedTo: {
    fontSize: 16,
    color: 'grey',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  addButton: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    textAlign: 'center',
    lineHeight: 40,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 10,
    padding: 20,
    paddingRight: 75,
  },
});

export default DormJobsListScreen;
