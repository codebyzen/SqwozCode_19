import React, { FC } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SurveyModalContainer from "../../containers/survey-modal-container";
import { Routes } from "../../libs/application-routes";
import { useClassname } from "../../libs/css";
import {
    getSurveyResult,
    getUser,
    toggleAuthModal,
} from "../../store/user-slice";
import img from "./img.svg";

import "./styles.scss";

const resultData: Record<string, string> = {
    "0": "Вы — любитель создавать шедевры искусства своими руками!",
    "1": "Вы — прирожденный танцор!",
    "2": "Вы — настоящий полиглот!",
    "3": "Вы — большой любитель музыки и пения!",
    "4": "Вы цените гармонию с собой и окружающим миром!",
    "5": "Вам нравится изучать современные технологии!",
    "6": "Вы — ценитель высокого искусства!",
    "7": "Вы любите литературу и активные дискуссии по этой теме!",
    "8": "Вы цените здоровый образ жизни!",
    "9": "Вы любите, когда дома царит уют!",
    "10": "Вы — любитель спротивных игр!",
    "11": "Вы любите дух соревнований!",
    "12": "Вы  прирожденный спортсмен!",
    "13": "Вы настоящий знаток в области истории!",
    "14": "Вы настоящий спортсмен!",
    "15": "Вы любите открывать для себя что-то новое!",
    "16": "Вам нравятся экскурсии!",
    "17": "Вы настоящий любитель интеллектуального досуга!",
};

const SurveyBanner: FC = () => {
    const className = useClassname("survey-banner");

    const [isOpened, setOpened] = useState(false);

    const user = useSelector(getUser);
    const dispath = useDispatch();

    const surveyResult = useSelector(getSurveyResult);

    return (
        <>
            <div className={className()}>
                {surveyResult ? (
                    <>
                        <div className={className("content")}>
                            <div className={className("title")}>
                                {resultData[surveyResult]}
                            </div>
                            <Link
                                to={`${Routes.List}?cluster=${surveyResult}#activities-list`}
                                className={className("button")}
                            >
                                Смотреть рекомендации по опросу
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={img} className={className("image")} />
                        <div className={className("content")}>
                            <div className={className("title")}>
                                Пройдите тест и определите любимые занятия
                            </div>
                            <div
                                className={className("button")}
                                onClick={() => {
                                    if (!user) {
                                        dispath(toggleAuthModal(true));
                                    }
                                    setOpened(true);
                                }}
                            >
                                Пройти тест по подбору занятия
                            </div>
                        </div>
                    </>
                )}
            </div>
            <SurveyModalContainer
                isOpened={user ? isOpened : false}
                onClose={() => setOpened(false)}
            />
        </>
    );
};

export default SurveyBanner;
