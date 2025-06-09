// 計算パラメータの型定義
export type DeckSize = number;
export type HandSize = number;
export type CardCount = number;

// 初手事故率計算のパラメータ
export type BadHandCalculationParams = {
  readonly deck: DeckSize;
  readonly hand: HandSize;
  readonly goodArtist: CardCount;
  readonly badArtist: CardCount;
};

// マリガン期待値計算のパラメータ
export type ExpectedMulliganParams = {
  readonly deck: DeckSize;
  readonly hand: HandSize;
  readonly Artist: CardCount;
};

// 組み合わせ計算のパラメータ
export type CombinationParams = {
  readonly n: number;
  readonly k: number;
};

// 計算結果の型
export type CalculationPercentage = number;
export type CalculationCount = number;
