import React, { FC, useRef } from "react";
import { useClassname } from "../../libs/css";
import ActivityCard from "../activity-card";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import "./styles.scss";
import "swiper/css";
import "swiper/css/navigation";

import { Activity } from "../../libs/api-client";
import { useCallback } from "react";

interface ActivitiesPresetProps {
    title: string;
    data: Array<Activity>;
    isLoading: boolean;
}

const ActivitiesPreset: FC<ActivitiesPresetProps> = ({
    title,
    data,
    isLoading,
}) => {
    const className = useClassname("activities-preset");
    const swiperRef = useRef<SwiperRef>(null);

    const handlePrev = useCallback(() => {
        swiperRef.current?.swiper.slidePrev();
    }, []);
    const handleNext = useCallback(() => {
        swiperRef.current?.swiper.slideNext();
    }, []);

    const presetData: Array<Activity> = isLoading
        ? Array(8)
              .fill(0)
              .map(() => ({
                  id: "",
                  title: "",
                  description: "",
                  isOnline: false,
                  clusterId: "",
              }))
        : data;

    return (
        <div className={className()}>
            <div className={className("title")}>{title}</div>

            <div className={className("items")}>
                <div className={className("prev")} onClick={handlePrev}>
                    <LeftOutlined />
                </div>

                <div className={className("next")} onClick={handleNext}>
                    <RightOutlined />
                </div>
                <Swiper
                    spaceBetween={24}
                    slidesPerView={3}
                    ref={swiperRef}
                    mousewheel={{ thresholdDelta: 40, forceToAxis: true }}
                    modules={[Mousewheel]}
                    loop
                >
                    {presetData.map((item) => (
                        <SwiperSlide>
                            <ActivityCard
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                info={
                                    item.isOnline
                                        ? "Онлайн занятие"
                                        : "Очное занятие"
                                }
                                clusterId={item.clusterId}
                                isLoading={isLoading}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ActivitiesPreset;
