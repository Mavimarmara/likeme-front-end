import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../components/ui';
import { styles } from './styles';
import { COLORS } from '../../../constants';
import { validationUtils } from '../../../utils';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (!validationUtils.isValidEmail(formData.email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'Senhas não coincidem');
      return;
    }

    Alert.alert('Sucesso', 'Conta criada com sucesso!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Anamnese' as never),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Digite seu nome completo"
              placeholderTextColor={COLORS.TEXT_LIGHT}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Digite seu email"
              placeholderTextColor={COLORS.TEXT_LIGHT}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="(11) 99999-9999"
              placeholderTextColor={COLORS.TEXT_LIGHT}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Digite sua senha"
              placeholderTextColor={COLORS.TEXT_LIGHT}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirme sua senha"
              placeholderTextColor={COLORS.TEXT_LIGHT}
              secureTextEntry
            />
          </View>

          <Button
            title="Criar Conta"
            onPress={handleRegister}
            fullWidth
            style={styles.registerButton}
          />

          <TouchableOpacity style={styles.loginLink}>
            <Text style={styles.loginText}>
              Já tem uma conta? <Text style={styles.loginLinkText}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
