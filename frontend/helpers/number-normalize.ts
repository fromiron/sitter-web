export const numberNormalize = (value: string | number) => {
    // 全角数字を半角数字に変換
    //　数字、-以外の文字は削除
    return value.toString().replace(/[^0-9-]/g, "").replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    })
};