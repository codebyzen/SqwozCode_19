import React, { FC } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useClassname } from "../../libs/css";

import "./styles.scss";

const mapData = [
    {
        geometry: {
            type: "Point",
            coordinates: [55.8, 37.8],
        },
        properties: {
            balloonContentHeader:
                '<a href="/activity?id=801357840">Курсы компьютерной грамотности</a>',
            balloonContentBody: "Начало занятия: 12:00",
            balloonContentFooter: "25 июня, 2023",
        },
    },
    {
        geometry: {
            type: "Point",
            coordinates: [55.81, 37.76],
        },
        properties: {
            balloonContentHeader:
                '<a href="/activity?id=801357840">Курсы компьютерной грамотности</a>',
            balloonContentBody: "Начало занятия: 12:00",
            balloonContentFooter: "25 июня, 2023",
        },
    },
    {
        geometry: {
            type: "Point",
            coordinates: [55.8, 37.7],
        },
        properties: {
            balloonContentHeader:
                '<a href="/activity?id=801346672">Скандинавская ходьба</a>',
            balloonContentBody: "Начало занятия: 12:00",
            balloonContentFooter: "25 июня, 2023",
        },
    },
    {
        geometry: {
            type: "Point",
            coordinates: [55.79, 37.75],
        },
        properties: {
            balloonContentHeader:
                '<a href="/activity?id=801346672">Скандинавская ходьба</a>',
            balloonContentBody: "Начало занятия: 12:00",
            balloonContentFooter: "25 июня, 2023",
        },
    },
];

const Map: FC = () => {
    const className = useClassname("map");
    const mapRef = useRef<ymaps.Map>();

    useEffect(() => {
        ymaps.ready(() => {
            if (!mapRef.current) {
                mapRef.current = new ymaps.Map("map", {
                    center: [55.8, 37.75],
                    zoom: 13,
                });

                mapData.map((item) => {
                    mapRef.current?.geoObjects.add(new ymaps.GeoObject(item));
                });
            }
        });
    }, []);

    return (
        <div className={className()}>
            <div className={className("title")}>Занятия рядом с вами</div>
            <div id="map" className={className("map")}></div>
        </div>
    );
};

export default Map;
