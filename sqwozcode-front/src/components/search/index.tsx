import React, { FC } from "react";
import { useClassname } from "../../libs/css";
import { Input } from "antd";

import "./styles.scss";
import Button from "../button";

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

const Search: FC<SearchProps> = ({ value, onChange, onSearch }) => {
    const className = useClassname("search");

    return (
        <div className={className()}>
            <Input
                value={value}
                className={className("input")}
                suffix={
                    <Button mode="active" size="l" onClick={onSearch}>
                        Найти
                    </Button>
                }
                placeholder="Введите название занятия"
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default Search;
