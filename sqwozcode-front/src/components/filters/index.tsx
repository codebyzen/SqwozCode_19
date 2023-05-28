import React, { FC, useEffect } from "react";
import { useClassname } from "../../libs/css";
import { Type, UrlParams } from "../../libs/url-params";
import { Checkbox } from "antd";
import moment from "moment";
import { DownOutlined, UpOutlined, CloseOutlined } from "@ant-design/icons";

import "./styles.scss";
import { firstLetterToUpperCase } from "../../libs/string";
import { typesConfig } from "../../libs/types";
import { useState } from "react";
import { Cluster } from "../../libs/api-client";
import Button from "../button";
import { useCallback } from "react";
import "moment/locale/ru";

export type FiltersData = Partial<Record<keyof UrlParams, string[]>>;

export interface FiltersProps {
    data: FiltersData;
    onChangeFilter: (key: keyof UrlParams, value: string[]) => void;
    clusters: Array<Cluster>;
}

type CheckboxGroupConfig = Array<{
    value: string;
    title: string;
}>;

const onlineConfig: CheckboxGroupConfig = [
    {
        value: "false",
        title: "Очно",
    },
    {
        value: "true",
        title: "Онлайн",
    },
];

const dayOfWeekConfig: CheckboxGroupConfig = [...new Array(7)].map((_, i) => {
    const name = moment(i)
        .startOf("week")
        .isoWeekday(i + 1)
        .format("dddd");

    return {
        value: i.toString(),
        title: firstLetterToUpperCase(name),
    };
});

const CheckboxGroup: FC<{
    config: CheckboxGroupConfig;
    value: string[];
    onChange: (value: string[]) => void;
}> = ({ value, onChange, config }) => {
    const className = useClassname("filters");

    return (
        <div className={className("checkbox-group")}>
            {config.map((item) => (
                <div className={className("checkbox")} key={item.value}>
                    <Checkbox
                        onChange={(e) => {
                            if (e.target.checked) {
                                onChange([...value, item.value]);
                            } else {
                                onChange(value.filter((i) => i !== item.value));
                            }
                        }}
                        checked={value.includes(item.value)}
                    >
                        {item.title}
                    </Checkbox>
                </div>
            ))}
        </div>
    );
};

const Filters: FC<FiltersProps> = ({ data, onChangeFilter, clusters }) => {
    moment.locale("ru");

    const className = useClassname("filters");
    const [isOpenedGroup, setOpenedGroup] = useState<
        Partial<Record<Type, boolean>>
    >({});

    useEffect(() => {
        clusters.map((item) => {
            if (data.cluster?.includes(item.id)) {
                setOpenedGroup((isOpenedGroup) => ({
                    ...isOpenedGroup,
                    [item.type]: true,
                }));
            }
        });
    }, [clusters]);

    const filters = ["search", "cluster", "online", "dayOfWeek"] as const;

    const resetFilters = useCallback(() => {
        filters.map((filter) => {
            onChangeFilter(filter, []);
        });
    }, [onChangeFilter]);

    const hasFilters = filters.filter((filter) => {
        return data[filter]?.length;
    }).length;

    return (
        <div>
            {hasFilters && (
                <div className={className("header")}>
                    <Button onClick={resetFilters} mode="active" size="m">
                        Сбросить фильтр{" "}
                        <CloseOutlined
                            className={className("header-close-icon")}
                        />
                    </Button>
                </div>
            )}
            <div className={className("filter")}>
                <div className={className("title")}>Формат</div>
                <CheckboxGroup
                    config={onlineConfig}
                    value={data.online || []}
                    onChange={(value) => {
                        onChangeFilter("online", value);
                    }}
                />
            </div>
            <div className={className("filter")}>
                <div className={className("title")}>Направления</div>
                {typesConfig.map(({ title, type }) => {
                    const options = clusters.filter(
                        (cluster) => cluster.type === type
                    );

                    return (
                        <>
                            <div
                                className={className("group-title")}
                                onClick={() =>
                                    setOpenedGroup({
                                        ...isOpenedGroup,
                                        [type]: !isOpenedGroup[type],
                                    })
                                }
                            >
                                {title}
                                {isOpenedGroup[type] ? (
                                    <UpOutlined
                                        className={className("expand-icon")}
                                    />
                                ) : (
                                    <DownOutlined
                                        className={className("expand-icon")}
                                    />
                                )}
                            </div>
                            {isOpenedGroup[type] && (
                                <div className={className("group-items")}>
                                    <CheckboxGroup
                                        config={options.map((option) => ({
                                            value: option.id,
                                            title: option.name,
                                        }))}
                                        value={data.cluster || []}
                                        onChange={(value) => {
                                            onChangeFilter("cluster", value);
                                            onChangeFilter("type", []);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    );
                })}
            </div>
            <div className={className("filter")}>
                <div className={className("title")}>День недели</div>
                <CheckboxGroup
                    config={dayOfWeekConfig}
                    value={data.dayOfWeek || []}
                    onChange={(value) => {
                        onChangeFilter("dayOfWeek", value);
                    }}
                />
            </div>
        </div>
    );
};

export default Filters;
