export interface cellProps {
  isMine: boolean;
  isSolution: boolean;
  neighboringMines: number;
  xIndex: number;
  yIndex: number;
  isFlagged: boolean;
}
export interface scoreEntryProps {
  score: number;
  date: string;
}

export interface score {
  username: string;
  score: number;
  createdAt: Date;
}
export interface gamePageData {
  cookieScores: score[] | null;
  DBScores: score[] | null;
  globalLeaderboard: score[] | null;
  gamesPlayed: number | null;
  userRank: number | null;
  username: string | null;
}
