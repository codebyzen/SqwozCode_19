import axios from "axios";
import { Type } from "./url-params";

interface ActivitiesListParams {
    preset?: string;
    search?: string;
    online?: boolean;
    limit?: number;
    offset?: number;
    cluster?: string;
    type?: string;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    picture?: string;
    isOnline: boolean;
    clusterId: string;
}

export interface Cluster {
    id: string;
    name: string;
    type: Type;
}

export interface User {
    id: string;
    cluster?: string;
}

// todo: error response

interface ApiClient {
    getUser: (id: string) => Promise<User>;
    createUser: (data: {
        fName: string;
        mName: string;
        lName: string;
        birth: string;
    }) => Promise<{
        id: string;
    }>;
    getActivitiesList: (
        params?: ActivitiesListParams
    ) => Promise<Array<Activity>>;
    getRecomends: (preset: string, id?: string) => Promise<Array<Activity>>;
    getClusters: () => Promise<Array<Cluster>>;
    getActivity: (id: string) => Promise<Activity>;
    saveSurveyResult: (cluserId: string, userId: string) => Promise<boolean>;
}

const apiBasePath = "http://api.sqwozcode.ru";
const defaultLimit = "10";

const listGetter = (queryParams: Record<string, string>) => {
    return axios
        .get(
            `${apiBasePath}/getActivitiesList?${new URLSearchParams(
                queryParams
            )}`
        )
        .then(function (response) {
            const items = response.data.message
                ? response.data.message.map((item: Record<string, string>) => ({
                      id: item.uid,
                      title: item.type3.replace("ОНЛАЙН ", ""),
                      description: item.d_level1,
                      isOnline: item.online || item.type3.includes("ОНЛАЙН"),
                      clusterId: item.clusterId,
                  }))
                : [];

            const resultItems: Array<Activity> = [];
            items.map((item: Activity) => {
                const existed = resultItems.find((i) => i.title === item.title);
                if (!existed) {
                    resultItems.push(item);
                }
            });

            return resultItems;
        })
        .catch(function (error) {
            console.log(error);
            return [];
        });
};

const useApiClient = (): ApiClient => {
    return {
        getActivitiesList: async (params) => {
            const queryParams: Record<string, string> = {};
            if (params?.preset) {
                queryParams.preset = params.preset;
            }
            if (params?.search) {
                queryParams.search = params.search;
            }

            if (params?.cluster) {
                queryParams.clusterIds = params.cluster;
            }

            if (params?.type && !params?.cluster) {
                queryParams.type = params.type;
            }

            const limit = params?.limit?.toString() || defaultLimit;
            const offset = params?.offset?.toString() || "0";

            if (typeof params?.online !== "undefined") {
                queryParams.online = params.online ? "1" : "0";
                queryParams.limit = limit;
                queryParams.offset = offset;

                return listGetter(queryParams);
            } else {
                const offlineLimit = Math.round(parseInt(limit) * 0.7);
                const onlineLimit = parseInt(limit) - offlineLimit;

                const offlineOffset = Math.round(parseInt(offset) * 0.7);
                const onlineOffset = parseInt(offset) - offlineOffset;

                const offlineItems = listGetter({
                    ...queryParams,
                    limit: offlineLimit.toString(),
                    offset: offlineOffset.toString(),
                    online: "0",
                });
                const onlineItems = listGetter({
                    ...queryParams,
                    limit: onlineLimit.toString(),
                    offset: onlineOffset.toString(),
                    online: "1",
                });

                const items = await Promise.all([
                    offlineItems,
                    onlineItems,
                ]).then(([off, on]) => {
                    const moreCount = Math.round(off.length / on.length);
                    const result: Array<Activity> = [];
                    off.map((_, i) => {
                        result.push(off[i]);
                        if (i % moreCount === 0) {
                            const onItem = on.pop();
                            if (onItem) {
                                result.push(onItem);
                            }
                        }
                    }, []);

                    return [...result, ...on];
                });

                return items;
            }
        },
        getUser: (userId: string) =>
            axios
                .get(`${apiBasePath}/getUser?uid=${userId}`)
                .then(function (response) {
                    return {
                        id: response.data.message[0].id,
                        cluster: response.data.message[0].clusterId,
                    };
                })
                .catch(function (error) {
                    console.log(error);
                    return {
                        id: "",
                    };
                }),
        createUser: (data) =>
            axios
                .post(
                    `${apiBasePath}/createUser`,
                    {
                        f_name: data.fName,
                        m_name: data.mName,
                        l_name: data.lName,
                        dob: data.birth,
                    },
                    {
                        headers: {
                            Origin: document.location.origin,
                        },
                    }
                )
                .then(function (response) {
                    console.log(response);
                    return {
                        id: response.data.message[0].uid,
                    };
                })
                .catch(function (error) {
                    console.log(error);
                    return {
                        id: "101351338",
                    };
                }),
        getClusters: () => {
            return axios
                .get(`${apiBasePath}/getClusters`)
                .then(function (response) {
                    const items = response.data.message
                        ? response.data.message.map(
                              (item: Record<string, string>) => ({
                                  id: item.clusterId,
                                  name: item.name,
                                  type: item.type,
                              })
                          )
                        : [];

                    return items;
                })
                .catch(function (error) {
                    console.log(error);
                    return [];
                });
        },
        getActivity: (id: string) => {
            return axios
                .get(`${apiBasePath}/getActivity?id=${id}`)
                .then(function (response) {
                    const item = response.data.message[0];
                    return {
                        id,
                        title: item.type3,
                        description: item.d_level1,
                        picture: item.picture,
                        isOnline: item.online,
                        clusterId: item.clusterId,
                    };
                })
                .catch(function (error) {
                    console.log(error);
                    // return {};

                    return {
                        id: "123",
                        title: "Предпринимательская деятельность в малом и среднем бизнесе",
                        description:
                            "Программа по изучению основ рыночной экономики, организационно-правовых форм предпринимательской деятельности, порядка создания микро-, малого и среднего предприятий, правовых основ предпринимательской деятельности, основ бухгалтерского учета и налогообложения, а также по формированию навыков создания собственного дела. ",
                        isOnline: false,
                        clusterId: "0",
                    };
                });
        },
        saveSurveyResult: (cluserId: string, userId: string) =>
            axios
                .get(
                    `${apiBasePath}/saveSurveyResult?clusterId=${cluserId}&userId=${userId}`
                )
                .then(function (response) {
                    console.log(response);
                    return true;
                })
                .catch(function (error) {
                    console.log(error);
                    return false;
                }),
        getRecomends: (preset, uid) => {
            let url = "";
            if (preset === "recommeds") {
                url = `${apiBasePath}/getRecomends?ml=mrg&id=${uid}`;
            }
            if (preset === "near") {
                url = `${apiBasePath}/getRecomends?ml=mrn&id=${uid}`;
            }
            if (preset === "similar") {
                url = `${apiBasePath}/getRecomends?ml=mrs&id=${uid}`;
            }

            return axios
                .get(url)
                .then(function (response) {
                    const items = response.data.message
                        ? response.data.message.map(
                              (item: Record<string, string>) => ({
                                  id: item.uid,
                                  title: item.type3.replace("ОНЛАЙН ", ""),
                                  description: item.d_level1,
                                  isOnline:
                                      item.online ||
                                      item.type3.includes("ОНЛАЙН"),
                                  clusterId: item.clusterId,
                              })
                          )
                        : [];

                    return items;
                })
                .catch(function (error) {
                    console.log(error);
                    return [];
                });
        },
    };
};

export default useApiClient;
