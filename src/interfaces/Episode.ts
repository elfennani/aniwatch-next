export interface Episode {
  id: string;
  number: number;
  thumbnail: string;
  resolution?: number
  duration?: number;
  dub: boolean
}