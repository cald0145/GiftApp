import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const SwipeablePersonItem = ({ person, onPress, onDelete, children }) => {
  // function to render the delete button when swiped
  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress}>
        {children}
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#DF2B3A',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    height: '100%',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    padding: 20,
  },
});

export default SwipeablePersonItem;
