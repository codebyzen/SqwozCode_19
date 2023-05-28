import React, { useState, FC } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useApiClient, { Activity } from "../libs/api-client";
import ActivityInfo from "../components/activity-info";

const useActivityLoader = () => {
    const apiClient = useApiClient();
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Activity>();

    const [searchParams] = useSearchParams();

    const id = searchParams.get("id") as string;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await apiClient.getActivity(id);
            setData(data);
            setLoading(false);
        };

        loadData();
    }, [id]);

    return {
        data,
        isLoading,
    };
};

const ActivityContainer: FC = () => {
    const { data, isLoading } = useActivityLoader();

    if (!data || isLoading) {
        return <div>loading</div>;
    }

    return <ActivityInfo data={data} />;
};

export default ActivityContainer;
