import {useEffect, useState} from "react";
import {animate, motion} from "framer-motion";


export default function NumberCountWidget({count, title}: {
    count: number
    title: string;
}) {
    const [renderCount, setRenderCount] = useState<number>(0)

    useEffect(() => {
        const controls = animate(0, count, {
            onUpdate: (value) => {
                if (Number.isSafeInteger(count)) {
                    const str = value.toFixed(0)
                    setRenderCount(Number(str));
                } else {
                    const str = value.toFixed(2)
                    setRenderCount(Number(str));
                }
            },
        });
        if (count === renderCount) {
            controls.stop()
        }
    }, [count])


    return (
        <div
            className="flex flex-col justify-center h-24 px-4 border border-opacity-50 rounded-md w-fit bg-neutral-content text-neutral border-base-200">
            <div className="text-sm font-medium text-primary">{title}</div>
            <div className="text-5xl text-center text-neutral">
                <motion.span>{renderCount}</motion.span>
            </div>
        </div>
    );
}
