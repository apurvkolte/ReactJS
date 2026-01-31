


import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [])


  //store data
  const addData = async () => {
    const newTotal = total + 10;
    setTotal(newTotal)
    await AsyncStorage.setItem('total', JSON.stringify(newTotal));
  }

  //get data
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("total");
      if (data) {
        setTotal(JSON.parse(data));
      };

    } catch (error) {
      console.error("Failed to load data", error);
    }
  }

  const clearData = async () => {
    await AsyncStorage.removeItem("total")
    setTotal(0)
  }


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 16 }}>Total :{total}</Text>
      <Button title="Increase" onPress={addData} />
      <Button title="Clear Data" onPress={clearData} />
    </View>
  )
}

export default App

const styles = StyleSheet.create({})