/** Abas de solução na Home (Todos, Produtos, Profissionais, Programas, Comunidades). */
export type SolutionTab = 'all' | 'communities' | 'products' | 'professionals' | 'programs';

/** Opção do carrossel de soluções (id + label). Compatível com ButtonCarouselOption<SolutionTab>. */
export interface SolutionOption {
  id: SolutionTab;
  label: string;
}

/** Opções padrão do filtro por solução (ids e labels fixos). */
export const solutionOptions: readonly SolutionOption[] = [
  { id: 'all', label: 'Todos' },
  { id: 'products', label: 'Produtos' },
  { id: 'professionals', label: 'Profissionais' },
  { id: 'programs', label: 'Programas' },
  { id: 'communities', label: 'Comunidades' },
] as const;
