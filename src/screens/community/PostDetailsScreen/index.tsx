import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PostDetailsHeader, FloatingMenu } from '@/components/ui';
import { CommunityStackParamList } from '@/types';
import { styles } from './styles';

type PostDetailsRouteProp = RouteProp<CommunityStackParamList, 'PostDetails'>;
type PostDetailsNavigationProp = StackNavigationProp<CommunityStackParamList, 'PostDetails'>;

const PostDetailsScreen: React.FC = () => {
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation<PostDetailsNavigationProp>();
  const { post } = route.params;

  const floatingMenuItems = [
    {
      id: 'create-post',
      icon: 'create',
      label: 'Criar Post',
      onPress: () => console.log('Criar post'),
    },
    {
      id: 'feed',
      icon: 'home',
      label: 'Feed Principal',
      onPress: () => navigation.navigate('CommunityList'),
    },
    {
      id: 'communities',
      icon: 'group',
      label: 'Comunidades',
      onPress: () => navigation.navigate('CommunityList'),
    },
    {
      id: 'messages',
      icon: 'message',
      label: 'Mensagens',
      onPress: () => console.log('Mensagens'),
    },
    {
      id: 'profile',
      icon: 'person',
      label: 'Perfil',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <PostDetailsHeader post={post} />
      <FloatingMenu items={floatingMenuItems} />
    </SafeAreaView>
  );
};

export default PostDetailsScreen;
