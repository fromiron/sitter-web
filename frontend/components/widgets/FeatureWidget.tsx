import { IconType } from "react-icons";

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
      className="flex items-center justify-center w-24 h-24 text-4xl border border-opacity-50 rounded-md cursor-pointer text-primary-content bg-primary border-base-200 "
    >
      <div className="w-10 h-10">
        <Icon />
      </div>
    </div>
  );
}
