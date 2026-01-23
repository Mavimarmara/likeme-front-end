import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
    paddingBottom: SPACING.XXL,
  },
  avatarContainer: {
    paddingTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  anamnesisPromptContainer: {
    paddingTop: SPACING.MD,
  },
  yourCommunitiesContainer: {
    paddingTop: SPACING.MD,
  },
  eventsContainer: {
    padding: SPACING.MD,
  },
  providersContainer: {
    paddingTop: SPACING.LG,
  },
  communitiesContainer: {
    paddingTop: SPACING.LG,
  },
  productsContainer: {
    paddingTop: SPACING.LG,
  },
  otherCommunitiesContainer: {
    paddingTop: SPACING.LG,
  },
});
