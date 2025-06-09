import { ok, err, type Result } from "neverthrow";
import type {
  BadHandCalculationParams,
  ExpectedMulliganParams,
  CombinationParams,
} from "../types/calculation";

// 基本的な数値バリデーション
const validateNonNegativeInteger = (
  value: number,
  fieldName: string
): Result<number, string> => {
  if (!Number.isInteger(value) || value < 0) {
    return err(`${fieldName}は非負の整数である必要があります。`);
  }
  return ok(value);
};

// 初手事故率計算のバリデーション
export const validateBadHandParams = (
  params: BadHandCalculationParams
): Result<BadHandCalculationParams, string> => {
  const { deck, hand, goodArtist, badArtist } = params;

  // 個別バリデーション
  const deckValidation = validateNonNegativeInteger(deck, "デッキ数");
  if (deckValidation.isErr()) {
    return err(deckValidation.error);
  }

  const handValidation = validateNonNegativeInteger(hand, "手札枚数");
  if (handValidation.isErr()) {
    return err(handValidation.error);
  }

  const goodArtistValidation = validateNonNegativeInteger(
    goodArtist,
    "良いアーティスト数"
  );
  if (goodArtistValidation.isErr()) {
    return err(goodArtistValidation.error);
  }

  const badArtistValidation = validateNonNegativeInteger(
    badArtist,
    "悪いアーティスト数"
  );
  if (badArtistValidation.isErr()) {
    return err(badArtistValidation.error);
  }

  // 相関バリデーション
  if (hand > deck) {
    return err("手札枚数はデッキ枚数以下にしてください。");
  }

  if (goodArtist + badArtist > deck) {
    return err("アーティストの合計枚数はデッキ枚数以下にしてください。");
  }

  return ok(params);
};

// マリガン期待値計算のバリデーション
export const validateExpectedMulliganParams = (
  params: ExpectedMulliganParams
): Result<ExpectedMulliganParams, string> => {
  const { deck, hand, Artist } = params;

  const deckValidation = validateNonNegativeInteger(deck, "デッキ枚数");
  if (deckValidation.isErr()) {
    return err(deckValidation.error);
  }

  const handValidation = validateNonNegativeInteger(hand, "手札枚数");
  if (handValidation.isErr()) {
    return err(handValidation.error);
  }

  const artistValidation = validateNonNegativeInteger(
    Artist,
    "アーティスト枚数"
  );
  if (artistValidation.isErr()) {
    return err(artistValidation.error);
  }

  if (hand > deck) {
    return err("手札枚数はデッキ枚数以下にしてください。");
  }

  if (Artist > deck) {
    return err("アーティストの枚数はデッキ枚数以下にしてください。");
  }

  return ok(params);
};

// 組み合わせ計算のバリデーション
export const validateCombinationParams = (
  params: CombinationParams
): Result<CombinationParams, string> => {
  const { n, k } = params;

  const nValidation = validateNonNegativeInteger(n, "n");
  if (nValidation.isErr()) {
    return err(nValidation.error);
  }

  const kValidation = validateNonNegativeInteger(k, "k");
  if (kValidation.isErr()) {
    return err(kValidation.error);
  }

  return ok(params);
};
