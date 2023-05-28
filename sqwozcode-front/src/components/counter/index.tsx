import React, { FC } from "react";
import "./styles.scss";

type CounterProps = {
    value: number;
    increment: () => void;
};

const Counter: FC<CounterProps> = (props) => {
    return (
        <div className="counter">
            <div className="counter__label">{props.value}</div>

            <div className="counter__button">
                <button onClick={props.increment}>увеличить</button>
            </div>
        </div>
    );
};

export default Counter;
