import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants';
import { logger } from '@/utils/logger';
import { isRncWebViewTurboModuleLinked, RNC_WEB_VIEW_TURBO_MODULE_NAME } from '@/utils/infrastructure/rncWebViewModule';

export interface EventWebViewSessionProps {
  url: string;
  onClose: () => void;
}

type WebViewComponent = React.ComponentType<{
  source: { uri: string };
  style?: object;
  startInLoadingState?: boolean;
  renderLoading?: () => React.ReactElement;
}>;

export const EventWebViewSession: React.FC<EventWebViewSessionProps> = ({ url, onClose }) => {
  const nativeLinked = useMemo(() => isRncWebViewTurboModuleLinked(), []);
  const [WebViewCmp, setWebViewCmp] = useState<WebViewComponent | null>(null);

  useEffect(() => {
    if (!nativeLinked) {
      logger.warn('[EventWebViewSession] Módulo nativo ausente; abrindo URL no navegador', {
        moduleName: RNC_WEB_VIEW_TURBO_MODULE_NAME,
        url,
      });
      void Linking.openURL(url)
        .catch((cause) => {
          logger.error('[EventWebViewSession] Falha ao abrir URL externa', { url, cause });
        })
        .finally(() => {
          onClose();
        });
      return;
    }

    let cancelled = false;
    void import('react-native-webview')
      .then((mod) => {
        if (!cancelled) {
          setWebViewCmp(() => mod.WebView as WebViewComponent);
        }
      })
      .catch((cause) => {
        logger.error('[EventWebViewSession] Falha ao carregar WebView', { url, cause });
        if (!cancelled) {
          void Linking.openURL(url)
            .catch((linkError) => {
              logger.error('[EventWebViewSession] Fallback openURL falhou', { url, cause: linkError });
            })
            .finally(() => {
              onClose();
            });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [nativeLinked, url, onClose]);

  if (!nativeLinked) {
    return null;
  }

  if (!WebViewCmp) {
    return (
      <Modal visible transparent={false} animationType='slide' onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' />
          </View>
        </View>
      </Modal>
    );
  }

  const WV = WebViewCmp;

  return (
    <Modal visible transparent={false} animationType='slide' onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
        <WV
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
