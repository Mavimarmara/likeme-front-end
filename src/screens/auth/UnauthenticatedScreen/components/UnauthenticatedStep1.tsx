import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Graphic, Logo } from '@/assets';
import { styles } from './UnauthenticatedStep1.styles';

interface UnauthenticatedStep1Props {
  onNext: () => void;
  onLogin: () => void;
}

const UnauthenticatedStep1: React.FC<UnauthenticatedStep1Props> = ({ onNext, onLogin }) => {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Graphic width="100%" height="100%" />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonLabel}>Next</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonLabel}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Logo width={280} height={84} />
      </View>

      <View style={styles.taglineContainer}>
        <Text style={styles.taglineText}>LIKE YOUR LIFE</Text>
      </View>
    </View>
  );
};


export default UnauthenticatedStep1;
