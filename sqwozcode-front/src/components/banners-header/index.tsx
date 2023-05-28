import React, { FC } from "react";
import { useClassname } from "../../libs/css";
import SurveyBanner from "../survey-banner";
import TypesBanner from "../types-banner";

import "./styles.scss";

const BannersHeader: FC = () => {
    const className = useClassname("banners-header");

    return (
        <div className={className()}>
            <div className={className("types-banner")}>
                <TypesBanner />
            </div>
            <div className={className("survey-banner")}>
                <SurveyBanner />
            </div>
        </div>
    );
};

export default BannersHeader;
