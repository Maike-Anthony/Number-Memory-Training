export interface Constant {
  name: string;
  digits: string;
}

export interface Mistake {
  date: string;
  time: string;
  constant: string;
  position: number;
  expected: string;
  received: string;
}

export interface Performance {
  date: string;
  time: string;
  constant: string;
  duration: string;
  startPosition: number;
  correctDigits: number;
  mistakes: number;
  accuracyRate: number;
  skipped: number;
}