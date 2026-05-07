import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '@/constants';

export interface EventWebViewSessionProps {
  url: string;
  onClose: () => void;
}

export const EventWebViewSession: React.FC<EventWebViewSessionProps> = ({ url, onClose }) => {
  return (
    <Modal visible transparent={false} animationType='slide' onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: url }}
          style={styles.webView}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size='large' />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DADADA',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#001137',
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
