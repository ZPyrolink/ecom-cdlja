import { NoteType } from 'app/entities/enumerations/note-type.model';

export interface INote {
  id: number;
  name?: string | null;
  type?: keyof typeof NoteType | null;
}

export type NewNote = Omit<INote, 'id'> & { id: null };
