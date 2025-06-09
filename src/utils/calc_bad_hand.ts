import { ok, err, type Result } from "neverthrow";
import { combination } from "./combination";

/**
 * 指定したハンド数で悪いアーティストのみを引く確率を計算します。
 *
 * @param deck - デッキ内の総カード数（非負の整数）
 * @param hand - 引くハンドの枚数（非負の整数、デッキ数以下）
 * @param goodArtist - デッキ内の良いアーティストカードの枚数（非負の整数）
 * @param badArtist - デッキ内の悪いアーティストカードの枚数（非負の整数）
 * @returns 悪いアーティストのみを引く確率（パーセンテージ）のResult型。計算不可能な場合はエラーを返す
 */
export function calcBadHand(
  deck: number,
  hand: number,
  goodArtist: number,
  badArtist: number
): Result<number, string> {
  // 入力検証: 全てのパラメータが非負の整数であることを確認
  if (!Number.isInteger(deck) || deck < 0) {
    return err("デッキ数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(hand) || hand < 0) {
    return err("手札枚数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(goodArtist) || goodArtist < 0) {
    return err("良いアーティスト数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(badArtist) || badArtist < 0) {
    return err("悪いアーティスト数は非負の整数である必要があります。");
  }

  // ハンド数がデッキ数を超えていないことを確認
  if (hand > deck) {
    return err("手札枚数はデッキ枚数以下にしてください。");
  }

  // アーティストの総数がデッキ数を超えていないことを確認
  if (goodArtist + badArtist > deck) {
    return err("アーティストの合計枚数はデッキ枚数以下にしてください。");
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
