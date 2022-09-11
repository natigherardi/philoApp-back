interface Quote {
  textContent: string;
  author: string;
  image: string;
  owner: string;
  id: string;
  favoritedBy?: string[];
  year?: number;
  school?: string;
  book?: string;
}

export default Quote;
