import { useEffect, useState } from "react";

export default function NumberCountWidget({
  count,
  title,
}: {
  count: number | undefined;
  title: string;
}) {
  const [customCount, setCustomCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (count !== undefined && customCount === undefined) {
      setCustomCount(count - 2);
    }

    if (
      count !== undefined &&
      customCount !== undefined &&
      count > customCount
    ) {
      setTimeout(() => setCustomCount(customCount + 1), 400);
    }
  }, [customCount, count]);

  if (count === undefined) {
    return null;
  }
  return (
    <div className="flex flex-col justify-center h-24 px-4 border border-opacity-50 rounded-md w-fit bg-neutral-content text-neutral border-base-200">
      <div className="text-sm font-medium text-primary">{title}</div>
      <div className="text-5xl text-center text-neutral">{customCount}</div>
    </div>
  );
}
