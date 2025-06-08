const memo: Map<string, number> = new Map();

/**
 * 組み合わせの数（nCk）を効率的に計算します。
 * メモ化を使用して、同じ計算が繰り返されるのを防ぎます。
 * @param n - 全体の要素数
 * @param k - 選ぶ要素の数
 * @returns 組み合わせの数
 */
export function combination(n: number, k: number): number {
  // 入力が非負の整数であることを検証
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("nは非負の整数である必要があります");
  }
  if (!Number.isInteger(k) || k < 0) {
    throw new Error("kは非負の整数である必要があります");
  }

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
  let actualK = k;
  if (actualK > n / 2) {
    actualK = n - actualK;
  }

  // 反復的にC(n, k) = n! / (k! * (n-k)!) を計算
  // オーバーフローを避けるため、除算を組み込んで計算
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }

  const roundedResult = Math.round(result);
  if (Math.abs(result - roundedResult) > 1e-10) {
    console.warn(`組み合わせ計算で非整数の結果: ${result}`);
  }
  memo.set(key, roundedResult);
  return roundedResult;
}
