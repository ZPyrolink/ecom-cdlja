import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '0a8abe93-fe4e-4570-8bd8-9bb84f5bc5a3',
};

export const sampleWithPartialData: IAuthority = {
  name: '071aebc0-049b-4029-a94d-775e88ca6f18',
};

export const sampleWithFullData: IAuthority = {
  name: '277e2016-b35e-4601-a790-7b2e1ad22971',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
