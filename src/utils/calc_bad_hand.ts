/**
 * 組み合わせの数（nCk）をメモ化を利用した再帰で計算します。
 * @param n - 全体の要素数
 * @param k - 選ぶ要素の数
 * @returns 組み合わせの数
 */
function combinWithMemo(n: number, k: number): number {
  // 計算結果を保存するキャッシュオブジェクト
  const memo: { [key: string]: number } = {};

  function recursiveCombin(n: number, k: number): number {
    const key = `${n},${k}`;
    // キャッシュに結果があればそれを返す
    if (key in memo) {
      return memo[key];
    }

    if (k === 0 || k === n) {
      return 1;
    }

    if (k < 0 || k > n) {
      return 0;
    }

    if (k > n / 2) {
      k = n - k;
    }

    // 計算結果をキャッシュに保存してから返す
    const result = recursiveCombin(n - 1, k - 1) + recursiveCombin(n - 1, k);
    memo[key] = result;
    return result;
  }

  return recursiveCombin(n, k);
}

export function calcBadHand(
  deck: number,
  hand: number,
  goodArtist: number,
  badArtist: number
): number {
  const allHand = combinWithMemo(deck, hand);

  const noArtist = combinWithMemo(deck - goodArtist - badArtist, hand);
  const existArtist = allHand - noArtist;

  const noGoodArtist = combinWithMemo(deck - goodArtist, hand);
  const existGoodArtist = allHand - noGoodArtist;

  const onlyBadArtist = existArtist - existGoodArtist;
  const onlyBadArtistRate = (onlyBadArtist / existArtist) * 100;

  return onlyBadArtistRate;
}
