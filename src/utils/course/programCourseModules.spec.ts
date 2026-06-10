import type { ProgramCourse } from '@/types/course/course';
import { moduleItemsFromProgramCourse } from '@/utils/course/programCourseModules';

describe('moduleItemsFromProgramCourse', () => {
  it('resolve mídia do acervo com os mesmos utilitários do feed', () => {
    const course: ProgramCourse = {
      type: 'program',
      communityId: 'community-1',
      steps: [
        {
          stepNumber: 1,
          title: 'Aula com imagem',
          postId: 'p-img',
          body: 'Conteúdo',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: null,
        },
      ],
      posts: [
        {
          postId: 'p-img',
          createdAt: '2026-01-01T00:00:00.000Z',
          data: { title: 'Aula com imagem', text: 'Conteúdo', fileId: 'img-1' },
        },
      ],
      files: [
        { fileId: 'img-1', fileUrl: 'https://cdn.example.com/lesson.png', attributes: { mimeType: 'image/png' } },
      ],
    };

    const modules = moduleItemsFromProgramCourse(course);

    expect(modules[0]?.image).toBe('https://cdn.example.com/lesson.png');
    expect(modules[0]?.attachments?.[0]?.kind).toBe('image');
  });

  it('resolve vídeo em post filho via postChildren', () => {
    const course: ProgramCourse = {
      type: 'program',
      communityId: 'community-1',
      steps: [
        {
          stepNumber: 1,
          title: 'Aula com vídeo',
          postId: 'parent-1',
          body: 'Texto da aula',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: null,
        },
      ],
      posts: [
        {
          postId: 'parent-1',
          _id: 'amity-parent-1',
          createdAt: '2026-01-01T00:00:00.000Z',
          data: { title: 'Aula com vídeo', text: 'Texto da aula' },
        },
      ],
      postChildren: [
        {
          postId: 'child-video-1',
          parentPostId: 'amity-parent-1',
          structureType: 'video',
          createdAt: '2026-01-01T00:01:00.000Z',
          data: { fileId: 'vid-1' },
        },
      ],
      files: [
        {
          fileId: 'vid-1',
          fileUrl: 'https://cdn.example.com/lesson.mp4',
          attributes: { mimeType: 'video/mp4' },
        },
        {
          fileId: 'vid-1_thumbnail',
          fileUrl: 'https://cdn.example.com/lesson-thumb.jpg',
          attributes: { mimeType: 'image/jpeg' },
        },
      ],
    };

    const modules = moduleItemsFromProgramCourse(course);

    expect(modules[0]?.videoUrl).toBe('https://cdn.example.com/lesson.mp4');
    expect(modules[0]?.attachments?.some((item) => item.kind === 'video')).toBe(true);
  });
});
