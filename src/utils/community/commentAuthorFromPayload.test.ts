import {
  commentAuthorIds,
  commentAuthorLabelFromPayload,
  communityUserAvatarUrl,
  communityUserMatchingComment,
} from '@/utils/community/commentAuthorFromPayload';

describe('commentAuthorFromPayload', () => {
  it('cruza userId do comentário com userPublicId na lista users', () => {
    const users = [{ userId: 'public-1', displayName: 'Ana Silva' }];
    const comment = { userPublicId: 'public-1' };

    expect(communityUserMatchingComment(comment, users)).toEqual(users[0]);
    expect(commentAuthorLabelFromPayload(comment, users, 'public-1')).toBe('Ana Silva');
  });

  it('resolve avatar por avatarFileId em files', () => {
    const user = { avatarFileId: 'file-1' };
    const files = [{ fileId: 'file-1', fileUrl: 'https://cdn.example/avatar.jpg' }];

    expect(communityUserAvatarUrl(user, files)).toBe('https://cdn.example/avatar.jpg');
  });

  it('commentAuthorIds deduplica ids equivalentes', () => {
    expect(commentAuthorIds({ userId: 'a', userPublicId: 'a' })).toEqual(['a']);
  });
});
