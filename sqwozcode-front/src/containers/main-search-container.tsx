import React, { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../components/search";
import { Routes } from "../libs/application-routes";
import { useUrlParams } from "../libs/url-params";

const MainSearchContainer: FC = () => {
    const [urlParams] = useUrlParams();
    const [search, setSearch] = useState(urlParams.search || "");

    const navigate = useNavigate();

    return (
        <Search
            value={search}
            onChange={setSearch}
            onSearch={() => navigate(`${Routes.List}?search=${search}`)}
        />
    );
};

export default MainSearchContainer;
