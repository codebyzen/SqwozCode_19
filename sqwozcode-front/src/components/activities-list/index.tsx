import React, { FC } from "react";
import { useClassname } from "../../libs/css";
import ActivityCard from "../activity-card";

import "./styles.scss";
import { Activity, Cluster } from "../../libs/api-client";
import Filters, { FiltersData } from "../filters";
import { UrlParams } from "../../libs/url-params";
import Button from "../button";
import { useAnchorScroll } from "../../libs/anchor-scroll";

interface ActivitiesListProps {
    title: string;
    data: Array<Activity>;
    isLoading: boolean;
    filtersData: FiltersData;
    onChangeFilter: (key: keyof UrlParams, value: string[]) => void;
    loadMore: () => void;
    clusters: Array<Cluster>;
}

const ActivitiesList: FC<ActivitiesListProps> = ({
    title,
    data,
    filtersData,
    onChangeFilter,
    loadMore,
    clusters,
    isLoading,
}) => {
    const className = useClassname("activities-list");
    useAnchorScroll();

    const listData: Array<Activity> = isLoading
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
            <div className={className("filters")}>
                <Filters
                    data={filtersData}
                    onChangeFilter={onChangeFilter}
                    clusters={clusters}
                />
            </div>

            <div className={className("list")} id="activities-list">
                <div className={className("title")}>{title}</div>
                {!listData.length ? (
                    <div className={className("empty")}>
                        <div className={className("empty-title")}>
                            К сожалению, по вашему запросу ничего не найдено
                        </div>
                        <div className={className("empty-text")}>
                            Попробуйте скорректировать запрос или изменить
                            параметры фильтрации
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={className("items")}>
                            {listData.map((item, i) => (
                                <div
                                    className={className("item")}
                                    key={`${item.title}${i}`}
                                >
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
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={loadMore}
                            size="l"
                            mode="active"
                            width="full"
                        >
                            Загрузить еще
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivitiesList;
