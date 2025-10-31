import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { validationUtils } from '@/utils';
import { AuthService } from '@/services';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!validationUtils.isValidEmail(formData.email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const authResult = await AuthService.loginWithEmail({
        email: formData.email,
        password: formData.password,
      });

      const backendResponse = await AuthService.sendToBackend(authResult);
      
      Alert.alert('Sucesso', 'Login realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('PersonalObjectives' as never),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const authResult = await AuthService.loginWithSocial(provider);
      const backendResponse = await AuthService.sendToBackend(authResult);
      
      Alert.alert('Sucesso', `Login com ${provider} realizado com sucesso!`, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('PersonalObjectives' as never),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message || `Erro ao fazer login com ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoLeft}>LIKE</Text>
            <View style={styles.logoIcon}>
              <View style={styles.orangeCircle} />
              <View style={styles.pinkCircle} />
            </View>
            <Text style={styles.logoRight}>ME</Text>
          </View>
          <Text style={styles.title}>Welcome back!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register' as never)}>
            <Text style={styles.registerText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Or access with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Text style={styles.facebookText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.googleText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={styles.appleText}>🍎</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
