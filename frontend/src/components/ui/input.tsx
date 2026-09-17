import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Input = ({ className, ref, ...props }: ComponentProps<"input">) => {
    return (
        <input
            {...props}
            ref={ref}
            className={twMerge("field", className)}
        />
    );
};

export default Input;
