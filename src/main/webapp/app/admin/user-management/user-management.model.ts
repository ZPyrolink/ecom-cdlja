export interface IUser {
  id: number | null;
  login?: string;
  email?: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  langKey?: string;
  activated?: boolean;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class User implements IUser {
  constructor(
    public id: number | null,
    public login?: string,
    public email?: string,
    public password?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public langKey?: string,
  ) {}
}

export type NewUser = Omit<User, 'id'> & { id: null };
