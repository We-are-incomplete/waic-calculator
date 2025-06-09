import { ok, err, type Result } from "neverthrow";
import type { CombinationParams } from "../types/calculation";
import { validateCombinationParams } from "./validation";

const memo: Map<string, number> = new Map();

/**
 * 組み合わせの数（nCk）を効率的に計算します。
 * メモ化を使用して、同じ計算が繰り返されるのを防ぎます。
 * 関数型アプローチで実装し、バリデーションを分離しています。
 */
export function combination(n: number, k: number): Result<number, string> {
  const params: CombinationParams = { n, k };

  // バリデーション（早期リターン）
  const validationResult = validateCombinationParams(params);
  if (validationResult.isErr()) {
    return err(validationResult.error);
  }

  const key = `${n},${k}`;
  if (memo.has(key)) {
    return ok(memo.get(key)!);
  }

  // 基本的なケースの処理
  if (k === 0 || k === n) {
    memo.set(key, 1);
    return ok(1);
  }

  if (k < 0 || k > n) {
    memo.set(key, 0);
    return ok(0);
  }

  // k > n/2 の場合、計算を最適化するため k = n - k を使用
  let actualK = k;
  if (actualK > n / 2) {
    actualK = n - actualK;
  }

  // 反復的にC(n, k) = n! / (k! * (n-k)!) を計算
  // オーバーフローを避けるため、除算を組み込んで計算
  let result = 1;
  for (let i = 0; i < actualK; i++) {
    // 修正: k を actualK に変更
    result = (result * (n - i)) / (i + 1);
  }

  const roundedResult = Math.round(result);
  // if (Math.abs(result - roundedResult) > 1e-10) {
  //   // console.warn(`組み合わせ計算で非整数の結果: ${result}`); // 警告メッセージを削除
  // }
  memo.set(key, roundedResult);
  return ok(roundedResult);
}
