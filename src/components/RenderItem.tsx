import React from 'react';
import styles from '../Styles';
import {Text, View, TouchableOpacity} from 'react-native';
import {Task} from '../../App';

interface ItemProps {
  item: Task;
  markDone: () => void;
  deleteFunction: () => void;
}

const RenderItem = ({item, markDone, deleteFunction}: ItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={markDone}>
        <Text style={item.done ? styles.textDone : styles.text}>
          {item.title}
        </Text>
        <Text style={item.done ? styles.textDone : styles.text}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {item.done && (
        <TouchableOpacity style={styles.removeButton} onPress={deleteFunction}>
          <Text style={styles.whiteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RenderItem;
