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
