import ElevationNumber from "@components/widgets/patials/ElevationNumber";

export default function NumberRatioWidget({count1, count2, title}: {
    count1: number | undefined;
    count2: number | undefined;
    title: string;
}) {
    const fixedCount1 = count1 ?? 0;
    const fixedCount2 = count2 ?? 0;


    return (
        <div
            className="flex flex-col justify-center h-24 px-4 border border-opacity-50 rounded-md w-fit bg-neutral-content text-neutral border-base-200">
            <div className="text-sm font-medium text-primary">{title}</div>
            <div className="text-center text-neutral">
                <div className="text-3xl">
                    <ElevationNumber to={fixedCount1 / fixedCount2}/>
                </div>
                <div className="text-xxs">
                    {fixedCount1} / {fixedCount2}
                </div>
            </div>
        </div>
    );
}
