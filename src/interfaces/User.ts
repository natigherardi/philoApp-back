export interface UserData {
  name: string;
  username: string;
  password: string;
  quotes?: string[];
  id: string;
}

export interface UserRegister {
  name: string;
  username: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}
