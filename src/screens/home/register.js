import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://sabateesh.pythonanywhere.com/register', {
        email: email,
        password: password,
      });

      if (response.data.success) {
        Alert.alert('Registration Successful', 'You can now login');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', 'An error occurred during registration');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signuptext}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
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

      <Text style={styles.text}>Minimum 8 characters.</Text>
      <Text style={styles.conditions}>By signing up, you agree to Wealthsimple's Terms of Use and Privacy Policy. By providing your email, you consent to receive communications from Wealthsimple.                 You can opt-out anytime.</Text>

      <TouchableOpacity style={styles.RegisterButton} onPress={handleRegister}>
            <Text style={styles.RegisterButtonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Add padding to the sides
  },
  input: {
    width: '100%',
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#4F4B47',
    borderRadius: 15,
  },
  text:{
    width: '100%',
    color:'#615F5C',
    textAlign:'left',
    marginBottom: 10, 
    fontSize:16
  },
  signuptext:{
    color:'#343232',
    fontSize:16,
    fontWeight:'700'
  },
  RegisterButton:{
    padding:20,
    backgroundColor:'#312F2E',
    width:'100%',
    borderRadius:40,
  },
  conditions:{
    paddingTop:370,
    paddingBottom:20,
    fontSize:13,
    lineHeight:23,
    color:'#55514E'
  },
  RegisterButtonText:{
    color:'#FFF',
    textAlign:'center',
    fontSize:18,
    fontWeight:'600'
  }
});

export default RegisterScreen;
