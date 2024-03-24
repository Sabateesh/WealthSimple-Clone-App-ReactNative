import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';
import axios from 'axios';
<link rel="stylesheet" href="https://use.typekit.net/wxk8pwy.css"></link>

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email: email,
        password: password,
      });
  
      if (response.data.success) {
        navigation.navigate('Main');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.TitleText}>Wealthsimple</Text>

      <Text style={styles.Text}>One login for all Wealthsimple products.</Text>
      <TextInput
        style={styles.input}
        placeholder="me@email.com"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.registerbut} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#3E3832',
    borderRadius: 15,
  },
  Text:{
    fontSize: 17,
    paddingBottom:30,

    color:'#3E3D3D',
    fontVariant:'900W'
  },
  loginButton:{
    backgroundColor: '#312F2E',
    padding:15,
    width: '90%',
    alignItems: 'center',
    borderRadius:10,
    marginTop:20
  },
  registerbut:{
    backgroundColor: '#FCFCFC',
    borderColor:'#000',
    borderWidth:1,
    padding:15,
    marginTop:8,
    width: '90%',
    borderRadius:10,
    alignItems: 'center',




  },
  loginButtonText:{
    fontSize:18,
    color: '#FFFFFE',
    fontWeight: '800'
  },
  TitleText:{
    fontSize:40,
    fontWeight:'900',
    paddingBottom:10,
    fontFamily:'EBGaramond-Bold',
    color:'#312F2E'



  }


});

export default LoginScreen;
