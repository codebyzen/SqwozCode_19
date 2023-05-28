import { useSearchParams } from "react-router-dom";

export enum Type {
    Health = "health",
    Mind = "mind",
    Soul = "soul",
}

export interface UrlParams {
    id?: string;
    type?: Type;
    search?: string;
    online?: string;
    dayOfWeek?: string;
    cluster?: string;
}

export const useUrlParams = (): [
    UrlParams,
    (params: keyof UrlParams, value: any) => void
] => {
    const [searchParams, setSearchParams] = useSearchParams();

    return [
        {
            type: searchParams.get("type") as Type,
            search: searchParams.get("search") || undefined,
            online: searchParams.get("online") || undefined,
            dayOfWeek: searchParams.get("dayOfWeek") || undefined,
            cluster: searchParams.get("cluster") || undefined,
        },
        (param, value) =>
            setSearchParams((prev) => {
                if (!value) {
                    prev.delete(param);
                } else {
                    prev.set(param, value.toString());
                }

                return prev;
            }),
    ];
};
