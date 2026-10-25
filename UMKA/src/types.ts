export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
}

export interface AdsResponse {
  items: Ad[];
  total: number;
  page: number;
  limit: number;
}