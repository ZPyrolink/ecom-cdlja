import { ILine, NewLine } from './line.model';

export const sampleWithRequiredData: ILine = {
  id: 31953,
};

export const sampleWithPartialData: ILine = {
  id: 5485,
};

export const sampleWithFullData: ILine = {
  id: 24692,
  content: 'enthusiastically that elevation',
};

export const sampleWithNewData: NewLine = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
