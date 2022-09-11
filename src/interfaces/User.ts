export interface UserLogin {
  username: string;
  password: string;
}
export interface UserFullData extends UserLogin {
  name: string;
  username: string;
  password: string;
  quotesFavorited?: string[];
  quotesCreated?: string[];
  id: string;
}

export interface UserRegister extends UserLogin {
  name: string;
}
