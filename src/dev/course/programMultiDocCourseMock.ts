import { PROGRAM_MULTI_DOC_TEST_COMMUNITY_ID } from '@/constants/course/programMultiDocTest';
import type { ProgramCourse } from '@/types/course/course';
import type { ApiResponse } from '@/types/infrastructure';

const MOCK_CREATED_AT = '2026-06-10T12:00:00.000Z';
const MOCK_PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const MOCK_XLSX_URL = 'https://go.microsoft.com/fwlink/?LinkID=521962&clcid=0x409';
const MOCK_DOC_URL = 'https://calibre-ebook.com/downloads/demos/demo.docx';

export function programMultiDocCourseMock(): ProgramCourse {
  return {
    type: 'program',
    communityId: PROGRAM_MULTI_DOC_TEST_COMMUNITY_ID,
    steps: [
      {
        stepNumber: 1,
        title: '[Mock] Materiais para download',
        postId: 'mock-program-step-docs',
        body: 'Esta sessão traz vários arquivos para validar o fluxo de download no protocolo.',
        createdAt: MOCK_CREATED_AT,
        updatedAt: null,
      },
      {
        stepNumber: 2,
        title: '[Mock] Sessão complementar',
        postId: 'mock-program-step-text',
        body: 'Sessão sem anexos — útil para alternar entre módulos no accordion.',
        createdAt: MOCK_CREATED_AT,
        updatedAt: null,
      },
    ],
    posts: [
      {
        postId: 'mock-program-step-docs',
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Materiais para download',
          text: 'Esta sessão traz vários arquivos para validar o fluxo de download no protocolo.',
        },
        childrenPosts: [
          {
            postId: 'mock-program-child-pdf-guia',
            sequenceNumber: 1,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-program-file-pdf-guia' },
          },
          {
            postId: 'mock-program-child-pdf-checklist',
            sequenceNumber: 2,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-program-file-pdf-checklist' },
          },
          {
            postId: 'mock-program-child-xlsx',
            sequenceNumber: 3,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-program-file-xlsx' },
          },
          {
            postId: 'mock-program-child-doc',
            sequenceNumber: 4,
            createdAt: MOCK_CREATED_AT,
            data: { fileId: 'mock-program-file-doc' },
          },
        ],
      },
      {
        postId: 'mock-program-step-text',
        createdAt: MOCK_CREATED_AT,
        data: {
          title: '[Mock] Sessão complementar',
          text: 'Sessão sem anexos — útil para alternar entre módulos no accordion.',
        },
      },
    ],
    files: [
      {
        fileId: 'mock-program-file-pdf-guia',
        fileUrl: MOCK_PDF_URL,
        attributes: { mimeType: 'application/pdf', name: 'guia-do-programa.pdf' },
      },
      {
        fileId: 'mock-program-file-pdf-checklist',
        fileUrl: MOCK_PDF_URL,
        attributes: { mimeType: 'application/pdf', name: 'checklist-semanal.pdf' },
      },
      {
        fileId: 'mock-program-file-xlsx',
        fileUrl: MOCK_XLSX_URL,
        attributes: {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          name: 'acompanhamento.xlsx',
        },
      },
      {
        fileId: 'mock-program-file-doc',
        fileUrl: MOCK_DOC_URL,
        attributes: {
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          name: 'orientacoes.docx',
        },
      },
    ],
  };
}

export function shouldUseProgramMultiDocCourseMock(communityId: string): boolean {
  return __DEV__ && communityId.trim() === PROGRAM_MULTI_DOC_TEST_COMMUNITY_ID;
}

export function programMultiDocCourseApiResponse(): ApiResponse<ProgramCourse> {
  return {
    success: true,
    data: programMultiDocCourseMock(),
  };
}
