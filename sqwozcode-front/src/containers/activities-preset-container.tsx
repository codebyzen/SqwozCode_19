import React, { useState, FC } from "react";
import { useEffect } from "react";
import ActivitiesPreset from "../components/activities-preset";
import useApiClient, { Activity } from "../libs/api-client";

const useActivitiesPresetLoader = (preset: string, userId?: string) => {
    const apiClient = useApiClient();
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Array<Activity>>([]);

    useEffect(() => {
        if (data.length) {
            return;
        }

        const fetchData = async () => {
            setLoading(true);

            let data: Array<Activity> = [];
            if (
                preset === "recommeds" ||
                preset === "near" ||
                preset === "similar"
            ) {
                if (userId) {
                    data = await apiClient.getRecomends(preset, userId);
                }
            } else {
                data = await apiClient.getActivitiesList({
                    preset,
                    limit: 40,
                });
            }

            setData(data);
            setLoading(false);
        };

        fetchData();
    }, [data]);

    return {
        data,
        isLoading,
    };
};

const ActivitiesPresetContainer: FC<{
    title: string;
    preset: string;
    userId?: string;
}> = React.memo(({ title, preset, userId }) => {
    const { data, isLoading } = useActivitiesPresetLoader(preset, userId);

    return <ActivitiesPreset title={title} data={data} isLoading={isLoading} />;
});

export default ActivitiesPresetContainer;
