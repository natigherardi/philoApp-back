export interface UserLogin {
  username: string;
  password: string;
}
export interface UserFullData extends UserLogin {
  name: string;
  quotes?: string[];
  id: string;
}

export interface UserRegister extends UserLogin {
  name: string;
}
