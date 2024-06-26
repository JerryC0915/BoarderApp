import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Button } from 'react-native';
import { supabase } from "../lib/supabase.js";

const BudgetList = ({ id, name, amount, onAmountChange, onDelete, userRole }) => (
  <View style={styles.budgetList}>
    <Text>{name}</Text>
    {userRole === 'admin' && (
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount.toString()}
        onChangeText={(value) => onAmountChange(id, parseFloat(value))}
      />
    )}
    {userRole === 'admin' && (
      <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
        <Text>Delete</Text>
      </TouchableOpacity>
    )}
  </View>
);

const AddItemModal = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (name.trim() && amount) {
      onSubmit({ name, amount: parseFloat(amount) });
      setName('');
      setAmount('');
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Item name"
            placeholderTextColor="#888"
            style={styles.modalInput}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Cost"
            placeholderTextColor="#888"
            style={styles.modalInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Button title="Add" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const EditBudgetModal = ({ visible, onClose, onSubmit, initialBudget }) => {
  const [budgetInput, setBudgetInput] = useState(initialBudget.toString());

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Total Budget:</Text>
          <TextInput
            style={styles.modalInput}
            value={budgetInput}
            keyboardType="numeric"
            onChangeText={setBudgetInput}
          />
          <Button title="Submit" onPress={() => onSubmit(parseFloat(budgetInput) || 0)} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const BudgetListScreen = ({ route }) => {
  const { dorm } = route.params;
  const [totalBudget, setTotalBudget] = useState(1000);
  const [items, setItems] = useState([]);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('budget_items').select('*').eq('dorm', dorm);
      setItems(data || []);
    };

    const fetchTotalBudget = async () => {
      const { data } = await supabase
        .from('dorm_budgets')
        .select('total_budget')
        .eq('dorm', dorm)
        .single();
      setTotalBudget(data?.total_budget || 1000);
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

    fetchItems();
    fetchTotalBudget();
    fetchUserRole();
  }, [dorm]);

  const handleAmountChange = async (id, amount) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, amount: amount } : item
    );
    setItems(newItems);

    await supabase
      .from('budget_items')
      .update({ amount: amount })
      .match({ id });
  };

  const handleAddItemSubmit = async (item) => {
    const newItem = { ...item, dorm };
    setItems([...items, newItem]);

    await supabase
      .from('budget_items')
      .insert([newItem]);
  };

  const handleDeleteItem = async (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);

    await supabase
      .from('budget_items')
      .delete()
      .match({ id });
  };

  const handleEditBudgetSubmit = async (newBudget) => {
    setTotalBudget(newBudget);
    setModalVisible(false);

    await supabase
      .from('dorm_budgets')
      .update({ total_budget: newBudget })
      .eq('dorm', dorm);
  };

  const calculateRemainingBudget = () => {
    const totalSpent = items.reduce((acc, item) => acc + item.amount, 0);
    return totalBudget - totalSpent;
  };

  return (
    <View style={styles.container}>
      <View style={styles.budgetInfo}>
        <Text style={styles.budgetText}>Total Budget: ${totalBudget.toFixed(2)}</Text>
        {userRole === 'admin' && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editButton}>
            <Text>Edit Budget</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.budgetText}>Remaining Budget: ${calculateRemainingBudget().toFixed(2)}</Text>
      <ScrollView style={styles.scrollView}>
        {items.map((item) => (
          <BudgetList
            key={item.id}
            id={item.id}
            name={item.name}
            amount={item.amount}
            onAmountChange={handleAmountChange}
            onDelete={handleDeleteItem}
            userRole={userRole}
          />
        ))}
      </ScrollView>
      {userRole === 'admin' && (
        <TouchableOpacity onPress={() => setAddItemModalVisible(true)} style={styles.addButton}>
          <Text>Add More Items</Text>
        </TouchableOpacity>
      )}
      <AddItemModal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        onSubmit={handleAddItemSubmit}
      />
      <EditBudgetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleEditBudgetSubmit}
        initialBudget={totalBudget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 18,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  budgetList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: 100,
    textAlign: 'right',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalView: {
    marginTop: 50,
    width: '90%',
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
  modalInput: {
    width: 200,
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    color: '#000',
    placeholderTextColor: '#888',
  },
});

export default BudgetListScreen;
