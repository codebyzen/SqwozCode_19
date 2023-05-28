import React, { FC } from "react";
import { useClassname } from "../../libs/css";

import img from "./img.png";

import "./styles.scss";

const OfflineBanner: FC = () => {
    const className = useClassname("offline-banner");

    return (
        <div className={className()}>
            <img src={img} className={className("image")} />
            <div className={className("title")}>
                Приходите к нам на очные занятия!
            </div>
            <div className={className("description")}>
                Занятия оффлайн помогут вам завести новые знакомства, с пользой
                провести время, отдохнуть душой и телом
            </div>
        </div>
    );
};

export default OfflineBanner;
