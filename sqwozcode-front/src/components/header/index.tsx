import React, { FC } from "react";
import { useClassname } from "../../libs/css";

import "./styles.scss";
import { Link } from "react-router-dom";
import { Routes } from "../../libs/application-routes";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import MainSearchContainer from "../../containers/main-search-container";
import { useUserSession } from "../../libs/user-session";
import { useCallback } from "react";

import img from "./glasses.svg";

interface HeaderProps {
    hasHome?: boolean;
}

const Header: FC<HeaderProps> = ({ hasHome }) => {
    const className = useClassname("header");
    const { userId, reset } = useUserSession();

    const handleLogout = useCallback(() => {
        reset();
        location.href = "/";
    }, [reset]);

    return (
        <div className={className()}>
            {hasHome && (
                <Link to={Routes.Main}>
                    <HomeOutlined className={className("home")} />
                </Link>
            )}
            <div className={className("help")}>
                Версия для слабовидящих{" "}
                <img src={img} className={className("glasses")} />
            </div>
            <MainSearchContainer />
            {userId && (
                <LogoutOutlined
                    onClick={handleLogout}
                    className={className("home")}
                />
            )}
        </div>
    );
};

export default Header;
