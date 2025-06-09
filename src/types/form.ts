// フォームフィールドの型定義
export type FormFieldType = "number" | "text" | "email";

export type FormField<T = string> = {
  readonly id: string;
  readonly label: string;
  readonly modelKey: T;
  readonly type: FormFieldType;
  readonly min?: number;
  readonly max?: number;
  readonly required?: boolean;
};

// 初手事故率計算用のフォームフィールド
export type BadHandFormField = FormField<
  "deck" | "hand" | "goodArtist" | "badArtist"
>;

// マリガン期待値計算用のフォームフィールド
export type ExpMulliganFormField = FormField<"deck" | "hand" | "artist">;

// フォームフィールド定義の関数
export const createBadHandFormFields = (): readonly BadHandFormField[] =>
  [
    {
      id: "deck",
      label: "デッキ枚数",
      modelKey: "deck",
      type: "number",
      min: 1,
      required: true,
    },
    {
      id: "hand",
      label: "手札枚数",
      modelKey: "hand",
      type: "number",
      min: 1,
      required: true,
    },
    {
      id: "goodArtist",
      label: "来てほしいArtistの枚数",
      modelKey: "goodArtist",
      type: "number",
      min: 0,
      required: true,
    },
    {
      id: "badArtist",
      label: "来てほしくないArtistの枚数",
      modelKey: "badArtist",
      type: "number",
      min: 0,
      required: true,
    },
  ] as const;

export const createExpMulliganFormFields =
  (): readonly ExpMulliganFormField[] =>
    [
      {
        id: "deck",
        label: "デッキ枚数",
        modelKey: "deck",
        type: "number",
        min: 1,
        required: true,
      },
      {
        id: "hand",
        label: "手札枚数",
        modelKey: "hand",
        type: "number",
        min: 1,
        required: true,
      },
      {
        id: "artist",
        label: "Artistの枚数",
        modelKey: "artist",
        type: "number",
        min: 0,
        required: true,
      },
    ] as const;
