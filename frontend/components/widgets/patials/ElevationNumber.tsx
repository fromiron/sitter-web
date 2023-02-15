import {useEffect, useState} from "react";
import {animate} from "framer-motion";

export default function ElevationNumber({to}: { to: number | undefined }) {
    const [renderCount, setRenderCount] = useState<number>(0)

    useEffect(() => {
        const controls = animate(0, to, {
            onUpdate: (value) => {
                if (value !== undefined) {
                    if (Number.isSafeInteger(to)) {
                        const str = value!.toFixed(0)
                        setRenderCount(Number(str));
                    } else {
                        const str = value!.toFixed(2)
                        setRenderCount(Number(str));
                    }
                }
            },
        });
        if (to === renderCount) {
            controls.stop()
        }
    }, [to])
    return (<>{renderCount}</>)
}