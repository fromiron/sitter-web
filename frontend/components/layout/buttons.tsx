import { BiReset } from "react-icons/bi";

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-10 ml-4 btn-sm btn btn-primary text-primary-content"
    >
      <BiReset />
    </button>
  );
}
