import { IconType } from "react-icons";

export function FeatureWarningWidget({
  Icon,
  onClick,
}: {
  Icon: IconType;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-10 h-10 ml-4 btn-sm btn btn-error text-primary-content"
    >
      <Icon />
    </div>
  );
}

export function FeatureWidget({
  Icon,
  onClick,
  size,
  disabled,
}: {
  Icon: IconType;
  onClick: () => void;
  size?: number;
  iconSize?: number;
  disabled?: boolean;
}) {
  // サーポートされないブラウザー対応の為、aspect-squareクラスの代わりに直接代入
  const aspect = size ? `h-${size} text-2xl ` : "w-10 h-10";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${aspect} btn-sm btn btn-primary text-primary-content`}
    >
      <Icon className="max-h-8" />
    </button>
  );
}
