import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 901,
  login: '0!6@lU\\?Jg\\+LSRmn\\)gJHG',
};

export const sampleWithPartialData: IUser = {
  id: 16520,
  login: 'P6+k_@cT',
};

export const sampleWithFullData: IUser = {
  id: 18955,
  login: 'D2_Ou',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
