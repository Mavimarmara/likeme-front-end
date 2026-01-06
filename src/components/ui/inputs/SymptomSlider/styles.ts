import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 55,
    width: '100%',
    position: 'relative',
    marginTop: 8,
  },
  sliderTrack: {
    position: 'absolute',
    top: 11, // 20% of 55
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(244, 243, 236, 1)',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    width: '100%',
  },
  optionWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    maxWidth: '20%',
  },
  radioButtonContainer: {
    width: 24,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 24,
    height: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 217, 217, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: 'rgba(251, 247, 229, 1)',
    borderColor: 'rgba(217, 217, 217, 1)',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 17, 55, 1)',
  },
  labelContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  label: {
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(110, 106, 106, 1)',
    textAlign: 'center',
    marginBottom: 2,
  },
  sublabel: {
    fontFamily: 'DM Sans',
    fontSize: 8,
    fontWeight: '500',
    color: 'rgba(110, 106, 106, 1)',
    textAlign: 'center',
  },
});

