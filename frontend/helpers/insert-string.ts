export default function insertString({original, insert, position}: {
    original: string,
    insert: string,
    position: number
}) {
    // stringのポジション（インデックス）の後、stringを連れてリターン
    if (position > original.length) {
        return original + insert;
    }
    return original.slice(0, position) + insert + original.slice(position);
}