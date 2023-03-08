export default function ContentTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center w-full mb-4 font-medium">
      <div className="min-w-fit">
        <span className="text-primary">● </span>
        {title}
      </div>
      <div className="w-full ml-2 border-t"></div>
    </div>
  );
}
