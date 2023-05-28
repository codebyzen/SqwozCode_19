import React from "react";
import BannersHeader from "../components/banners-header";
import Header from "../components/header";
import Layout from "../components/layout";
import ActivitiesListContainer from "../containers/activities-list-container";
import AuthModalContainer from "../containers/auth-modal-container";

const ListPage = () => (
    <>
        <Layout>
            <Header hasHome />
            <BannersHeader />
            <ActivitiesListContainer />
            <AuthModalContainer />
        </Layout>
    </>
);

export default ListPage;
