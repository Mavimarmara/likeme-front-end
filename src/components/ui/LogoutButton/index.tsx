import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { AuthService } from '@/services';
import { styles } from './styles';

interface LogoutButtonProps {
  onPress?: () => void;
  label?: string;
  style?: any;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  onPress, 
  label = 'Log out',
  style 
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      
      if (onPress) {
        onPress();
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style, isLoading && styles.buttonDisabled]} 
      onPress={handleLogout}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default LogoutButton;

