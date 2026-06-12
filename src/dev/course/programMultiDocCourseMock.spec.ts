import { moduleItemsFromProgramCourse } from '@/utils/course/programCourseModules';
import { programMultiDocCourseMock } from '@/dev/course/programMultiDocCourseMock';

describe('programMultiDocCourseMock', () => {
  it('expõe mais de um arquivo para download na primeira sessão', () => {
    const course = programMultiDocCourseMock();
    const modules = moduleItemsFromProgramCourse(course);
    const docsModule = modules[0];

    expect(docsModule?.attachments?.filter((item) => item.kind !== 'image' && item.kind !== 'video')).toHaveLength(4);
    expect(docsModule?.attachments?.map((item) => item.fileName)).toEqual([
      'guia-do-programa.pdf',
      'checklist-semanal.pdf',
      'acompanhamento.xlsx',
      'orientacoes.docx',
    ]);
  });
});
