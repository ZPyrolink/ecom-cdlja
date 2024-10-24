import { INote } from 'app/entities/note/note.model';

export interface ILine {
  id: number;
  content?: string | null;
  note?: INote | null;
}

export type NewLine = Omit<ILine, 'id'> & { id: null };
