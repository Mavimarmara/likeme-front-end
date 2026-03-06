import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './styles';

export interface StepperStep {
  id: string;
  label: string;
}

export type StepperProps = {
  steps: StepperStep[];
  currentStepId: string;
  onStepPress?: (stepId: string) => void;
};

const Stepper: React.FC<StepperProps> = ({ steps, currentStepId, onStepPress }) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index <= safeIndex;
        const canGoBack = onStepPress && index < safeIndex;
        const isCurrentStep = index === safeIndex;

        const content = (
          <>
            <Text style={[isActive ? styles.labelActive : styles.labelInactive]}>{step.label}</Text>
            <View style={[styles.line, isActive ? styles.lineActive : styles.lineInactive]} />
          </>
        );

        if (canGoBack) {
          return (
            <Pressable
              key={step.id}
              style={styles.item}
              onPress={() => onStepPress(step.id)}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              accessibilityRole='button'
              accessibilityLabel={`${step.label}, voltar`}
            >
              {content}
            </Pressable>
          );
        }

        return (
          <View
            key={step.id}
            style={styles.item}
            accessibilityRole='text'
            accessibilityState={isCurrentStep ? { selected: true } : undefined}
            accessibilityLabel={isCurrentStep ? `${step.label}, etapa atual` : step.label}
          >
            {content}
          </View>
        );
      })}
    </View>
  );
};

export default Stepper;
