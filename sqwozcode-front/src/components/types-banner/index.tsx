import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Routes } from "../../libs/application-routes";
import { useClassname } from "../../libs/css";
import { typesConfig } from "../../libs/types";
import { useUrlParams } from "../../libs/url-params";
import Button from "../button";
import img from "./img.png";

import "./styles.scss";

const TypesBanner: FC = () => {
    const className = useClassname("types-banner");

    const [urlParams] = useUrlParams();

    return (
        <div className={className()}>
            <div className={className("title")}>
                Занятия под любой образ жизни
            </div>
            {typesConfig.map(({ title, type }) => {
                const isActive = type === urlParams.type;
                if (isActive) {
                    return (
                        <div className={className("link")} key={type}>
                            <Button mode={"active"} size="m" isDisabled>
                                {title}
                            </Button>
                        </div>
                    );
                }

                return (
                    <Link
                        to={`${Routes.List}?type=${type}`}
                        className={className("link")}
                        key={title}
                    >
                        <Button mode={"plain"} size="m">
                            {title}
                        </Button>
                    </Link>
                );
            })}
            <img src={img} className={className("image")} />
        </div>
    );
};

export default TypesBanner;
