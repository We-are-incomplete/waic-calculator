const memo: Map<string, number> = new Map();

/**
 * 組み合わせの数（nCk）を効率的に計算します。
 * メモ化を使用して、同じ計算が繰り返されるのを防ぎます。
 * @param n - 全体の要素数
 * @param k - 選ぶ要素の数
 * @returns 組み合わせの数
 */
export function combination(n: number, k: number): number {
  const key = `${n},${k}`;
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  // 基本的なケースの処理
  if (k === 0 || k === n) {
    memo.set(key, 1);
    return 1;
  }

  if (k < 0 || k > n) {
    memo.set(key, 0);
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

  const roundedResult = Math.round(result);
  memo.set(key, roundedResult);
  return roundedResult;
}
