export type AcquisitionKind = 'protocol' | 'service';

export interface AcquisitionListItem {
  id: string;
  kind: AcquisitionKind;
  productId: string;
  title: string;
  image: string;
  badges: string[];
  acquiredAt: string;
  subscriptionId?: string;
}
