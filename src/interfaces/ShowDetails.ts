import { Episode } from './Episode'

export interface ShowDetails {
  id: number
  allanimeId: string
  episodes: Episode[]
  title: string;
  banner: string;
  cover: string;
  type: "ANIME" | "MANGA",
  description: string
  genres: string[]
  episodesCount: number
  progress?: number
  year: number
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