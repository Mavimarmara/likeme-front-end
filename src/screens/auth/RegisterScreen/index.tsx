import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, TextInput, PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { GradientSplash3 } from '@/assets';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [fullName, setFullName] = useState(route.params?.userName || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [insurance, setInsurance] = useState('');

  const handleNext = () => {
    navigation.navigate('PersonalObjectives' as never, { userName: fullName || route.params?.userName || 'Usuário' });
  };

  const handleSkip = () => {
    navigation.navigate('PersonalObjectives' as never, { userName: fullName || route.params?.userName || 'Usuário' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header onBackPress={() => navigation.goBack()} />

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Title
              title="Let's start,"
              variant="large"
              rightAdornment={<Image source={GradientSplash3} style={styles.titleAdornment} resizeMode="cover" />}
            />

            <View style={styles.invitationSection}>
              <Text style={styles.invitationQuestion}>Did you come from a provider's invitation?</Text>
              <TextInput
                label="Enter code"
                value={invitationCode}
                onChangeText={setInvitationCode}
                placeholder="Code"
              />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                For us to be able to personalize your experience, we need some more information.
              </Text>

              <View style={styles.fieldsContainer}>
                <TextInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                />

                <TextInput
                  label="Age"
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Gender"
                  value={gender}
                  onChangeText={setGender}
                  placeholder="Gender"
                />

                <TextInput
                  label="Weight"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Weight"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Height"
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Height"
                  keyboardType="numeric"
                />

                <TextInput
                  label="Insurance"
                  value={insurance}
                  onChangeText={setInsurance}
                  placeholder="Insurance"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <ButtonGroup style={styles.buttonGroup}>
            <PrimaryButton label="Next" onPress={handleNext} />
            <SecondaryButton label="Skip information" onPress={handleSkip} />
          </ButtonGroup>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
