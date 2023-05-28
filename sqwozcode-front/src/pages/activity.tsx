import React from "react";
import Layout from "../components/layout";
import Header from "../components/header";
import ActivityContainer from "../containers/activity-container";

const ActivityPage = () => (
    <>
        <Layout>
            <Header hasHome />
            <ActivityContainer />
        </Layout>
    </>
);

export default ActivityPage;
