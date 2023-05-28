import React, { useState, FC } from "react";
import { useEffect } from "react";
import ActivitiesList from "../components/activities-list";
import useApiClient, { Activity, Cluster } from "../libs/api-client";
import { UrlParams, useUrlParams } from "../libs/url-params";

const useActivitiesListLoader = () => {
    const apiClient = useApiClient();
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Array<Activity>>([]);
    const [offset, setOffset] = useState(0);
    const limit = 40;

    const [clusters, setClusters] = useState<Array<Cluster>>([]);

    const [urlParams] = useUrlParams();

    useEffect(() => {
        const loadData = async () => {
            const data = await apiClient.getClusters();
            setClusters(data);
        };

        loadData();
    }, []);

    const listParams = {
        search: urlParams.search,
        cluster: urlParams.cluster,
        online:
            urlParams.online === "true"
                ? true
                : urlParams.online === "false"
                ? false
                : undefined,
        type: urlParams.type,
        limit,
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await apiClient.getActivitiesList(listParams);
            setData(data);
            setLoading(false);
        };

        loadData();
    }, [
        listParams.search,
        listParams.cluster,
        listParams.online,
        listParams.type,
    ]);

    useEffect(() => {
        const loadMoreData = async () => {
            const moreData = await apiClient.getActivitiesList({
                ...listParams,
                offset,
            });
            setData([...data, ...moreData]);
        };

        loadMoreData();
    }, [offset]);

    return {
        data,
        isLoading,
        loadMore: () => {
            setOffset(offset + limit);
        },
        clusters,
    };
};

const ActivitiesListContainer: FC = () => {
    const { data, isLoading, loadMore, clusters } = useActivitiesListLoader();
    const [urlParams, addUrlParam] = useUrlParams();

    return (
        <ActivitiesList
            title="Список занятий"
            data={data}
            isLoading={isLoading}
            filtersData={{
                online: urlParams.online?.split(",") || [],
                dayOfWeek: urlParams.dayOfWeek?.split(",") || [],
                cluster: urlParams.cluster?.split(",") || [],
                search: urlParams.search?.split(",") || [],
            }}
            onChangeFilter={(key: keyof UrlParams, value: string[]) => {
                addUrlParam(key, value.join(","));
            }}
            loadMore={loadMore}
            clusters={clusters}
        />
    );
};

export default ActivitiesListContainer;
