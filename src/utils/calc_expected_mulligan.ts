import { ok, err, type Result } from "neverthrow";
import { combination } from "./combination";
import type {
  ExpectedMulliganParams,
  CalculationCount,
} from "../types/calculation";
import { validateExpectedMulliganParams } from "./validation";

/**
 * マリガンの期待値を計算します。
 * 関数型アプローチで実装し、バリデーションを分離しています。
 */
export function calcExpMulligan(
  deck: number,
  hand: number,
  artist: number
): Result<CalculationCount, string> {
  const params: ExpectedMulliganParams = { deck, hand, artist };

  // バリデーション（早期リターン）
  const validationResult = validateExpectedMulliganParams(params);
  if (validationResult.isErr()) {
    return err(validationResult.error);
  }

  const allHandResult = combination(deck, hand);
  if (allHandResult.isErr()) {
    return err(allHandResult.error);
  }
  const allHand = allHandResult.value;

  const noArtistResult = combination(deck - artist, hand);
  if (noArtistResult.isErr()) {
    return err(noArtistResult.error);
  }
  const noArtist = noArtistResult.value;

  const allMinusNo = allHand - noArtist;

  // ゼロ除算エラーを回避: allMinusNoが0の場合は0を返す
  if (allMinusNo === 0) {
    return ok(0);
  }

  return ok(noArtist / allMinusNo);
}
