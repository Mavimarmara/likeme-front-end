import { useCallback, useRef, type RefObject } from 'react';
import { ScrollView, type LayoutChangeEvent } from 'react-native';

const SCROLL_FOCUS_OFFSET_PX = 80;

export function useScrollToFocusedField(scrollViewRef: RefObject<ScrollView | null>) {
  const contentYRef = useRef(0);
  const containerYRef = useRef(0);
  const fieldYRef = useRef<Record<string, number>>({});

  const scrollToFocusedField = useCallback(
    (fieldKey: string) => {
      const scrollView = scrollViewRef.current;
      const y = fieldYRef.current[fieldKey];
      if (scrollView == null || typeof y !== 'number') return;
      scrollView.scrollTo({ y: Math.max(0, y - SCROLL_FOCUS_OFFSET_PX), animated: true });
    },
    [scrollViewRef],
  );

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    contentYRef.current = event.nativeEvent.layout.y;
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    containerYRef.current = event.nativeEvent.layout.y;
  }, []);

  const handleFieldLayout = useCallback(
    (fieldKey: string) => (event: LayoutChangeEvent) => {
      fieldYRef.current[fieldKey] = contentYRef.current + containerYRef.current + event.nativeEvent.layout.y;
    },
    [],
  );

  return {
    scrollToFocusedField,
    handleContentLayout,
    handleContainerLayout,
    handleFieldLayout,
  };
}
