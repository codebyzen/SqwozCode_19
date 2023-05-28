import React from "react";
import BannersHeader from "../components/banners-header";
import Layout from "../components/layout";
import ActivitiesPresetContainer from "../containers/activities-preset-container";
import AuthModalContainer from "../containers/auth-modal-container";
import OfflineBanner from "../components/offline-banner";
import Header from "../components/header";
import Map from "../components/map";
import { useSelector } from "react-redux";
import { getUser } from "../store/user-slice";

const notAuthorizedPresets = [
    {
        title: "Подходит всем",
        preset: "popular",
    },
    {
        title: "В здоровом теле — здоровый дух",
        preset: "health",
    },
    {
        title: "Век живи — век учись",
        preset: "mind",
    },
];

const authorizedPresets = [
    {
        title: "Подходит всем",
        preset: "popular",
    },
    {
        title: "Рекомендации для вас",
        preset: "recommeds",
    },
    {
        title: "Выбор ваших соседей",
        preset: "near",
    },
];

const MainPage = () => {
    const user = useSelector(getUser);
    const presets = user ? authorizedPresets : notAuthorizedPresets;

    return (
        <>
            <Layout>
                <Header />
                <BannersHeader />
                {presets.map((preset, i) => (
                    <div key={preset.title}>
                        <ActivitiesPresetContainer
                            {...preset}
                            userId={user?.id}
                        />
                        {i === 1 && <OfflineBanner key="offline" />}
                    </div>
                ))}
                {user?.id && <Map />}
            </Layout>
            <AuthModalContainer />
        </>
    );
};

export default MainPage;
