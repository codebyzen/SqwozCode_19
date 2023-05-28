import React, { FC, PropsWithChildren } from "react";
import { useClassname } from "../../libs/css";

import "./styles.scss";

const Layout: FC<PropsWithChildren> = (props) => {
    const className = useClassname("layout");

    return (
        <div className={className()}>
            <div className={className("content")}>{props.children}</div>
        </div>
    );
};

export default Layout;
