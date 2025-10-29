import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { validationUtils } from '@/utils';
import { AuthService } from '@/services';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = async () => {
    if (!validationUtils.isValidEmail(formData.email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Erro', 'Você deve aceitar os termos e condições');
      return;
    }

    setIsLoading(true);
    try {
      const authResult = await AuthService.registerWithEmail({
        email: formData.email,
        password: formData.password,
      });

      const backendResponse = await AuthService.sendToBackend(authResult);
      
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Anamnese' as never),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToApp = () => {
    navigation.navigate('Anamnese' as never);
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const authResult = await AuthService.loginWithSocial(provider);
      const backendResponse = await AuthService.sendToBackend(authResult);
      
      Alert.alert('Sucesso', `Login com ${provider} realizado com sucesso!`, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Anamnese' as never),
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
          <Text style={styles.title}>Let's make an account?</Text>
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

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && <View style={styles.checkboxChecked} />}
            </TouchableOpacity>
            <Text style={styles.termsText}>I accept the terms and conditions</Text>
          </View>

          <TouchableOpacity 
            style={[styles.createAccountButton, isLoading && styles.buttonDisabled]} 
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createAccountText}>Create account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.goToAppButton} onPress={handleGoToApp}>
            <Text style={styles.goToAppText}>No, I want to go straight to the app</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
            <Text style={styles.loginText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Or access with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Facebook')}
            >
              <Text style={styles.facebookText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Google')}
            >
              <Text style={styles.googleText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Apple')}
            >
              <Text style={styles.appleText}>🍎</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
