import { toast } from "react-toastify";

export function copyToClipboard(str: string) {
  navigator.clipboard
    .writeText(str)
    .then(() => {
      toast.success(`コピー済 「${str}」`);
    })
    .catch(() => {
      toast.success("コピーに失敗しました。");
    });
}
