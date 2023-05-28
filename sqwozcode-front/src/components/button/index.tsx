import React, { FC, PropsWithChildren } from "react";
import { useClassname } from "../../libs/css";

import "./styles.scss";

interface ButtonProps {
    size?: "m" | "l";
    mode: "plain" | "active" | "icon";
    onClick?: () => void;
    isDisabled?: boolean;
    width?: "full";
}

const Button: FC<PropsWithChildren<ButtonProps>> = (props) => {
    const className = useClassname("button");

    return (
        <div
            onClick={props.onClick}
            className={className({
                mode: props.mode,
                size: props.size,
                disabled: props.isDisabled,
                width: props.width,
            })}
        >
            {props.children}
        </div>
    );
};

export default Button;
