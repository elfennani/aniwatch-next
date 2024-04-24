import { Episode } from './Episode'
import ShowRelation from './ShowRelation';
import Tag from './Tag';

export interface ShowDetails {
  id: number
  allanimeId?: string
  episodes?: Episode[]
  title: string;
  banner: string | null;
  cover: string;
  type: "ANIME" | "MANGA",
  description: string
  genres?: string[]
  episodesCount: number
  progress?: number
  year: number,
  relations: ShowRelation[]
  tags?: Tag[]
}

/**
 * title
 * banner
 * cover
 * type
 * episodes
 * genres
 * description
 */