import { ok, err, type Result } from "neverthrow";
import { combination } from "./combination";

/**
 * マリガンの期待値を計算します。
 * @param deck - デッキ内の総カード数
 * @param hand - 引く手札の枚数
 * @param Artist - デッキ内のアーティストカードの枚数
 * @returns マリガンの期待値のResult型
 */

export function calcExpMulligan(
  deck: number,
  hand: number,
  Artist: number
): Result<number, string> {
  // 入力検証: 全てのパラメータが非負の整数であることを確認
  if (!Number.isInteger(deck) || deck < 0) {
    return err("デッキ枚数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(hand) || hand < 0) {
    return err("手札枚数は非負の整数である必要があります。");
  }
  if (!Number.isInteger(Artist) || Artist < 0) {
    return err("アーティスト枚数は非負の整数である必要があります。");
  }

  // ハンド枚数がデッキ枚数を超えていないことを確認
  if (hand > deck) {
    return err("手札枚数はデッキ枚数以下にしてください。");
  }

  // アーティストの枚数がデッキ枚数を超えていないことを確認
  if (Artist > deck) {
    return err("アーティストの枚数はデッキ枚数以下にしてください。");
  }

  const allHandResult = combination(deck, hand);
  if (allHandResult.isErr()) {
    return err(allHandResult.error);
  }
  const allHand = allHandResult.value;

  const noArtistResult = combination(deck - Artist, hand);
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
