/**
 * 組み合わせの数（nCk）を効率的に計算します。
 * @param n - 全体の要素数
 * @param k - 選ぶ要素の数
 * @returns 組み合わせの数
 */
function combination(n: number, k: number): number {
  // 基本的なケースの処理
  if (k === 0 || k === n) {
    return 1;
  }

  if (k < 0 || k > n) {
    return 0;
  }

  // k > n/2 の場合、計算を最適化するため k = n - k を使用
  if (k > n / 2) {
    k = n - k;
  }

  // 反復的にC(n, k) = n! / (k! * (n-k)!) を計算
  // オーバーフローを避けるため、除算を組み込んで計算
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }

  return Math.round(result);
}

export function calcBadHand(
  deck: number,
  hand: number,
  goodArtist: number,
  badArtist: number
): number {
  const allHand = combination(deck, hand);

  const noArtist = combination(deck - goodArtist - badArtist, hand);
  const existArtist = allHand - noArtist;

  const noGoodArtist = combination(deck - goodArtist, hand);
  const existGoodArtist = allHand - noGoodArtist;

  const onlyBadArtist = existArtist - existGoodArtist;
  const onlyBadArtistRate = (onlyBadArtist / existArtist) * 100;

  return onlyBadArtistRate;
}
