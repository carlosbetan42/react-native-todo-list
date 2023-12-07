import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import RenderItem from './src/components/RenderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './src/Styles';

export interface Task {
  title: string;
  done: boolean;
  date: Date;
}

const initialState = [] as Task[];

const App = () => {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<Task[]>(initialState);

  const storeData = async (value: Task[]) => {
    try {
      await AsyncStorage.setItem('mytodo-tasks', JSON.stringify(value));
    } catch (e) {}
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('mytodo-tasks');
      if (value !== null) {
        const tasksLocal = JSON.parse(value);
        setTasks(tasksLocal);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, []);

  const addTask = () => {
    if (!text) return;
    const tmp = [...tasks];

    const index = tmp.findIndex(el => el.title === text);
    if (index > -1) {
      Alert.alert('Atención', 'Ya existe una tarea con el nombre ingresado', [
        {text: 'Aceptar'},
      ]);
      return;
    }

    const newTask = {
      title: text,
      done: false,
      date: new Date(),
    };
    tmp.push(newTask);
    setTasks(tmp);
    storeData(tmp);
    setText('');
  };

  const markDone = (task: Task) => {
    const tmp = [...tasks];
    const index = tmp.findIndex(el => el.title === task.title);
    if (index > -1) {
      const todo = tmp[index];
      todo.done = !todo.done;
      setTasks(tmp);
      storeData(tmp);
    }
  };

  const deleteFunction = (task: Task) => {
    Alert.alert('Atención', '¿Estás seguro de eliminar la tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Aceptar',
        onPress: () => {
          const tmp = [...tasks];
          const index = tmp.findIndex(el => el.title === task.title);
          if (index > -1) {
            tmp.splice(index, 1);
            setTasks(tmp);
            storeData(tmp);
          }
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: Task}) => {
    return (
      <RenderItem
        item={item}
        deleteFunction={() => deleteFunction(item)}
        markDone={() => markDone(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis tareas por hacer</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Agregar nueva tarea"
          value={text}
          onChangeText={(t: string) => setText(t)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.whiteText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.scrollContainer}>
        <FlatList data={tasks} renderItem={renderItem} />
      </View>
    </View>
  );
};

export default App;
