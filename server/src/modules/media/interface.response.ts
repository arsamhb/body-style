import { LocalizedString } from '../../core/i18n/types';

export interface MediaReadResponse {
  id: string;
  url: string;
  thumbUrl: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  alt: LocalizedString;
  originalName: string;
  createdAt: string;
}
