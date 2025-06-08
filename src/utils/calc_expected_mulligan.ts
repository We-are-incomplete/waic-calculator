import { combination } from "./combination";

export function calcExpMulligan(
  deck: number,
  hand: number,
  Artist: number
): number {
  // 入力検証: 全てのパラメータが非負の整数であることを確認
  if (!Number.isInteger(deck) || deck < 0) {
    throw new Error("デッキ枚数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(hand) || hand < 0) {
    throw new Error("手札枚数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(Artist) || Artist < 0) {
    throw new Error("アーティスト枚数は非負の整数である必要があります。");
  }

  // ハンド枚数がデッキ枚数を超えていないことを確認
  if (hand > deck) {
    throw new Error("手札枚数はデッキ枚数以下にしてください。");
  }

  // アーティストの枚数がデッキ枚数を超えていないことを確認
  if (Artist > deck) {
    throw new Error("アーティストの枚数はデッキ枚数以下にしてください。");
  }

  const allHand = combination(deck, hand);

  const noArtist = combination(deck - Artist, hand);

  // ゼロ除算エラーを回避: existArtistが0の場合は0を返す
  if (allHand === 0) {
    return 0;
  }

  const allMinusNo = allHand - noArtist;

  return (noArtist * allHand) / (allMinusNo * allMinusNo);
}
