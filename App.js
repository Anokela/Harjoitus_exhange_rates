import { StyleSheet, Text, View, TextInput, ActivityIndicator } from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';

const API_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=';
const API_KEY = '55f0b8d853a2dfebf6acb4333e642616';

export default function App() {
  const [eur, setEur] = useState('');
  const [rate, setRate] = useState(0);
  const [result, setResult] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    const address = API_URL + API_KEY;
    fetch(address)
      .then(res => res.json())
      .then((result) => {
        // console.log(result);
        const tempArray = Array()
        tempArray.push({label: 'GBP', value: result.rates.GBP});
        tempArray.push({label: 'SEK', value: result.rates.SEK});
        tempArray.push({label: 'NOK', value: result.rates.NOK});
        tempArray.push({label: 'USD', value: result.rates.USD});
        setRate(result.rates.GBP);
        setRates(tempArray);
        setError(null);
        setIsLoading(false);
      }, (error) => {
        setError(error);
        setIsLoading(false);
        setRate(0);
      })
  }, [])
  
  
  const calculate = (text) => {
    setEur(text);
    setResult(text * rate);
  }

  const changeRate = (value) => {
    setRate(value);
    setResult(eur * value);
  }

  if(isLoading) {
    return (<View style={styles.container}><ActivityIndicator size='large'/></View>);
  }
  else if (error) {
    return (<View style={styles.container}><Text>{error.message}</Text></View>);
  }
  else {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Currency calculator</Text>
        <Text style={styles.field}>Eur</Text>
        <TextInput 
          style={styles.field} 
          value={eur} 
          onChangeText={text => calculate(text)} 
          keyboardType='decimal-pad' 
          placeholder='Amount of euros'
        />
        <Picker
          style={styles.list}
          onValueChange={(itemValue) => changeRate(itemValue)}
          selectedValue={rate}
        >
          {rates.map((currency, index) => (
            <Picker.Item key={index} label={currency.label} value={currency.value} />
          ))}
        </Picker>
        <Text style={styles.field}>{result.toFixed(2)}</Text>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  field: {
    margin: 10,
  },
  list: {
      margin: 10,
  },
});
