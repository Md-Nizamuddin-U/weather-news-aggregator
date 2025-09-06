export type Weather = {
  temp: number;
  description: string;
  main: string;
  icon: string;
  date?: string;
};

export type ForecastDay = {
  date: string;
  tempMin: number;
  tempMax: number;
  weather: string;
  icon: string;
};

export type NewsArticle = {
  source: { id: string | null; name: string };
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
};
