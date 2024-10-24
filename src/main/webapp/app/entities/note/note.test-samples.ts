import { INote, NewNote } from './note.model';

export const sampleWithRequiredData: INote = {
  id: 21053,
};

export const sampleWithPartialData: INote = {
  id: 9466,
};

export const sampleWithFullData: INote = {
  id: 30745,
  name: 'yippee',
  type: 'REMINDER',
};

export const sampleWithNewData: NewNote = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
