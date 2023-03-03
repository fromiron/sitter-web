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
}: {
  Icon: IconType;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-10 h-10 ml-4 btn-sm btn btn-primary text-primary-content"
    >
      <Icon />
    </div>
  );
}
