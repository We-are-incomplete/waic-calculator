import { combination } from "./combination";

/**
 * 指定したハンド数で悪いアーティストのみを引く確率を計算します。
 *
 * @param deck - デッキ内の総カード数（非負の整数）
 * @param hand - 引くハンドの枚数（非負の整数、デッキ数以下）
 * @param goodArtist - デッキ内の良いアーティストカードの枚数（非負の整数）
 * @param badArtist - デッキ内の悪いアーティストカードの枚数（非負の整数）
 * @returns 悪いアーティストのみを引く確率（パーセンテージ）。計算不可能な場合は0を返す
 */
export function calcBadHand(
  deck: number,
  hand: number,
  goodArtist: number,
  badArtist: number
): number {
  // 入力検証: 全てのパラメータが非負の整数であることを確認
  if (!Number.isInteger(deck) || deck < 0) {
    throw new Error("デッキ数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(hand) || hand < 0) {
    throw new Error("手札枚数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(goodArtist) || goodArtist < 0) {
    throw new Error("良いアーティスト数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(badArtist) || badArtist < 0) {
    throw new Error("悪いアーティスト数は非負の整数である必要があります。");
  }

  // ハンド数がデッキ数を超えていないことを確認
  if (hand > deck) {
    throw new Error("手札枚数はデッキ枚数以下にしてください。");
  }

  // アーティストの総数がデッキ数を超えていないことを確認
  if (goodArtist + badArtist > deck) {
    throw new Error("アーティストの合計枚数はデッキ枚数以下にしてください。");
  }

  const allHand = combination(deck, hand);

  const noArtist = combination(deck - goodArtist - badArtist, hand);
  const existArtist = allHand - noArtist;

  // ゼロ除算エラーを回避: existArtistが0の場合は0を返す
  if (existArtist === 0) {
    return 0;
  }

  const noGoodArtist = combination(deck - goodArtist, hand);
  const existGoodArtist = allHand - noGoodArtist;

  const onlyBadArtist = existArtist - existGoodArtist;
  const onlyBadArtistRate = (onlyBadArtist / existArtist) * 100;

  return onlyBadArtistRate;
}
