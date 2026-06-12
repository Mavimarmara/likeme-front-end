import { fireEvent, render } from '@testing-library/react-native';
import PollCard from './index';
import type { Poll } from '@/types';

jest.mock('@/hooks/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { date?: string }) => {
      if (key === 'community.poll.closedDisclaimer') {
        return 'Esta enquete já foi finalizada';
      }
      if (key === 'community.poll.closedOn') {
        return `Enquete encerrada em ${params?.date ?? ''}`;
      }
      return key;
    },
  }),
}));

const closedPoll: Poll = {
  id: 'post-poll-1',
  pollId: 'poll-1',
  question: 'Qual opção?',
  totalVotes: 10,
  isFinished: true,
  endedAt: new Date('2026-06-01T00:00:00.000Z'),
  options: [
    {
      id: 'opt-a',
      answerId: 'opt-a',
      text: 'Opção A',
      votes: 7,
      percentage: 70,
    },
    {
      id: 'opt-b',
      answerId: 'opt-b',
      text: 'Opção B',
      votes: 3,
      percentage: 30,
    },
  ],
};

describe('PollCard', () => {
  it('exibe disclaimer e impede voto quando enquete está encerrada', () => {
    const onVote = jest.fn();
    const { getByText } = render(<PollCard poll={closedPoll} onVote={onVote} />);

    expect(getByText('Esta enquete já foi finalizada')).toBeTruthy();
    fireEvent.press(getByText('Opção A'));
    fireEvent.press(getByText('Opção B'));
    expect(onVote).not.toHaveBeenCalled();
  });

  it('impede alterar voto quando enquete encerrada com opção já selecionada', () => {
    const onVote = jest.fn();
    const pollWithVote: Poll = {
      ...closedPoll,
      options: closedPoll.options.map((option, index) => ({
        ...option,
        isSelected: index === 0,
      })),
    };

    const { getByText } = render(<PollCard poll={pollWithVote} onVote={onVote} disabled />);

    expect(getByText('Esta enquete já foi finalizada')).toBeTruthy();
    fireEvent.press(getByText('Opção B'));
    expect(onVote).not.toHaveBeenCalled();
  });
});
