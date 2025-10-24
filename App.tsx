import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>LikeMe - Health & Wellness</Text>
        <Text style={styles.subtitle}>Sua jornada para uma vida mais saudável começa aqui</Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🏥 Acompanhe seu Bem-estar</Text>
          <Text style={styles.feature}>💚 Monitore sua saúde</Text>
          <Text style={styles.feature}>👩‍⚕️ Conecte-se com Profissionais</Text>
          <Text style={styles.feature}>📱 App em desenvolvimento</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Em breve</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;