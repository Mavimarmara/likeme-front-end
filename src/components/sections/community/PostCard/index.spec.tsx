import { render } from '@testing-library/react-native';
import PostCard from './index';
import type { Post } from '@/types';

jest.mock('@/hooks', () => {
  const actual = jest.requireActual('@/hooks');
  return {
    ...actual,
    usePost: () => ({ activePoll: undefined, submitPollVote: jest.fn() }),
    usePostReplies: () => ({
      likeCount: 0,
      isLiked: false,
      isLiking: false,
      togglePostLike: jest.fn(),
    }),
  };
});

jest.mock('@/hooks/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Badge: ({ label }: { label: string }) => React.createElement(Text, { testID: 'badge' }, label),
  };
});

const basePost = (): Post => ({
  id: 'post-1',
  userId: 'u1',
  content: 'Conteúdo do post',
  comments: [],
  createdAt: new Date('2026-01-01'),
  likes: 0,
});

describe('PostCard', () => {
  it('renderiza Image com URI quando há imagem (sem vídeo)', () => {
    const uri = 'https://cdn.example.com/post-photo.png';
    const { getByTestId } = render(
      <PostCard
        post={{ ...basePost(), image: uri }}
        postEngagement={{ likeCount: 0, isLiked: false, isLiking: false, togglePostLike: jest.fn() }}
      />,
    );

    const img = getByTestId('post-card-image-only');
    expect(img.props.source).toEqual({ uri });
  });

  it('não exibe bloco de mídia quando image é só espaços', () => {
    const { queryByTestId } = render(
      <PostCard
        post={{ ...basePost(), image: '   \t  ' }}
        postEngagement={{ likeCount: 0, isLiked: false, isLiking: false, togglePostLike: jest.fn() }}
      />,
    );

    expect(queryByTestId('post-card-image-only')).toBeNull();
    expect(queryByTestId('post-card-video-poster')).toBeNull();
  });

  it('usa poster com imagem quando há vídeo e thumbnail', () => {
    const poster = 'https://cdn.example.com/thumb.jpg';
    const video = 'https://cdn.example.com/video.mp4';
    const { getByTestId } = render(
      <PostCard
        post={{ ...basePost(), image: poster, videoUrl: video }}
        postEngagement={{ likeCount: 0, isLiked: false, isLiking: false, togglePostLike: jest.fn() }}
      />,
    );

    const img = getByTestId('post-card-video-poster');
    expect(img.props.source).toEqual({ uri: poster });
  });
});
