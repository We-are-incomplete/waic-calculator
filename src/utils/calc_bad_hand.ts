import { ok, err, type Result } from "neverthrow";
import { combination } from "./combination";
import type { BadHandCalculationParams, CalculationPercentage } from "../types/calculation";
import { validateBadHandParams } from "./validation";

/**
 * 指定したハンド数で悪いアーティストのみを引く確率を計算します。
 * 関数型アプローチで実装し、バリデーションを分離しています。
 */
export function calcBadHand(
  deck: number,
  hand: number,
  goodArtist: number,
  badArtist: number,
): Result<CalculationPercentage, string> {
  const params: BadHandCalculationParams = {
    deck,
    hand,
    goodArtist,
    badArtist,
  };

  // バリデーション（早期リターン）
  const validationResult = validateBadHandParams(params);
  if (validationResult.isErr()) {
    return err(validationResult.error);
  }

  const allHandResult = combination(deck, hand);
  if (allHandResult.isErr()) {
    return err(allHandResult.error);
  }
  const allHand = allHandResult.value;

  const noArtistResult = combination(deck - goodArtist - badArtist, hand);
  if (noArtistResult.isErr()) {
    return err(noArtistResult.error);
  }
  const noArtist = noArtistResult.value;

  const existArtist = allHand - noArtist;

  // ゼロ除算エラーを回避: existArtistが0の場合は0を返す
  if (existArtist === 0) {
    return ok(0);
  }

  const noGoodArtistResult = combination(deck - goodArtist, hand);
  if (noGoodArtistResult.isErr()) {
    return err(noGoodArtistResult.error);
  }
  const noGoodArtist = noGoodArtistResult.value;

  const existGoodArtist = allHand - noGoodArtist;

  const onlyBadArtist = existArtist - existGoodArtist;
  const onlyBadArtistRate = (onlyBadArtist / existArtist) * 100;

  return ok(onlyBadArtistRate);
}
