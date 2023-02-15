import ElevationNumber from "@components/widgets/patials/ElevationNumber";

export default function NumberCountWidget({count, title}: {
    count: number | undefined;
    title: string;
}) {
    return (
        <div
            className="flex flex-col justify-center h-24 px-4 border border-opacity-50 rounded-md w-fit bg-neutral-content text-neutral border-base-200">
            <div className="text-sm font-medium text-primary">{title}</div>
            <div className="text-5xl text-center text-neutral">
                <ElevationNumber to={count}/>
            </div>
        </div>
    );
}
