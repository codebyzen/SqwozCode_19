import React, { FC } from "react";
import { useClassname } from "../../libs/css";
import { Row, Col } from "antd";
import {
    EnvironmentFilled,
    CalendarOutlined,
    TeamOutlined,
    FileOutlined,
} from "@ant-design/icons";

import "./styles.scss";
import { Activity } from "../../libs/api-client";
import ActivityImage from "../activity-image";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { LeftOutlined } from "@ant-design/icons";
import { Routes } from "../../libs/application-routes";
import ActivitiesPresetContainer from "../../containers/activities-preset-container";

interface ActivityInfoProps {
    data: Activity;
}

const ActivityInfo: FC<ActivityInfoProps> = ({ data }) => {
    const className = useClassname("activity-info");
    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        navigate(Routes.List);
    }, [navigate]);

    return (
        <div className={className()}>
            <div onClick={handleBack} className={className("back-button")}>
                <LeftOutlined /> Вернуться к списку
            </div>
            <Row gutter={[16, 24]}>
                <Col span={8}>
                    <div className={className("enroll-card")}>
                        <ActivityImage
                            clusterId={data.clusterId}
                            className={className("image")}
                        />
                        <a
                            href="https://www.mos.ru/"
                            target="_blank"
                            className={className("enroll-button")}
                        >
                            Записаться на занятие
                        </a>
                    </div>
                </Col>
                <Col span={16}>
                    <div className={className("title-card")}>
                        <div className={className("title-card-title")}>
                            {data.title}
                        </div>
                        <div className={className("title-card-geo")}>
                            <EnvironmentFilled
                                className={className("title-card-geo-icon")}
                            />
                            г. Москва, Ленинградский проспект, дом 80, корпус Г
                        </div>
                    </div>
                </Col>
                <Col span={8}></Col>
                <Col span={16}>
                    <div className={className("info-block")}>
                        <div className={className("info-block-title")}>
                            Информация о занятии
                        </div>
                        <div className={className("info-block-text")}>
                            {data.description}
                        </div>
                        <div className={className("info-block-items")}>
                            <div className={className("info-block-item")}>
                                <div className={className("info-block-label")}>
                                    <CalendarOutlined /> Расписание занятий
                                </div>
                                <div className={className("info-block-data")}>
                                    <ul>
                                        <li>Ср 16:00-19:00</li>
                                        <li>Сб 10:00-13:00</li>
                                        <li>Пн 16:00-19:00</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={className("info-block-item")}>
                                <div className={className("info-block-label")}>
                                    <TeamOutlined /> Преподаватель
                                </div>
                                <div className={className("info-block-data")}>
                                    Петров Олег Николаевич
                                    <div
                                        className={className(
                                            "info-block-data-s"
                                        )}
                                    >
                                        стаж преподавания 10 лет
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={className("info-block")}>
                        <div className={className("info-block-title")}>
                            Как подать заявку очно
                        </div>
                        <div className={className("info-block-text")}>
                            <div className={className("info-block-text-p")}>
                                Записаться в группы можно, оставив онлайн-заявку
                                на портале, а также обратившись в
                                территориальный центр социального обслуживания;
                                в организацию, оказывающую услуги по адресу
                                проведения занятий; в ближайший МФЦ.
                            </div>
                            <div className={className("info-block-text-p")}>
                                Возьмите с собой паспорт, СНИЛС и социальную
                                карту москвича. Заполните заявление назапись в
                                кружок и станьте участником проекта «Московское
                                долголетие»!
                            </div>
                        </div>
                        <div className={className("info-block-items")}>
                            <div className={className("info-block-item")}>
                                <div className={className("info-block-label")}>
                                    <FileOutlined /> Запись в группу ведет
                                </div>
                                <div className={className("info-block-data")}>
                                    <ul>
                                        <li>
                                            ГБУ ТЦСО "Беговой" филиал "Сокол"
                                        </li>
                                        <li>
                                            Телефон для справок:
                                            +7(495)870-44-44
                                        </li>
                                        <li>
                                            Адрес: г. Москва, улица Сальвадора
                                            Альенде, дом 1 (на карте)
                                        </li>
                                        <li>Панфиловская (5 мин. пешком)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <ActivitiesPresetContainer
                title="С этим занятием смотрят"
                preset="similar"
                userId={data.id}
            />
        </div>
    );
};

export default ActivityInfo;
