import React, { FC } from "react";
import { useClassname } from "../../libs/css";
import { Modal, Input, DatePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import img from "./img.svg";

import "./styles.scss";
import Button from "../button";
import { useState } from "react";
import { useCallback } from "react";

export interface AuthModalFormData {
    fName: {
        value: string;
        error: boolean;
    };
    mName: {
        value: string;
        error: boolean;
    };
    lName: {
        value: string;
        error: boolean;
    };
    birth: {
        value: string;
        error: boolean;
    };
}

interface AuthModalProps {
    isOpened: boolean;
    onSubmit: (data: AuthModalFormData) => void;
    onClose: () => void;
}

const AuthModal: FC<AuthModalProps> = (props) => {
    const className = useClassname("auth-modal");

    const [formState, setFormState] = useState<AuthModalFormData>({
        fName: {
            value: "",
            error: false,
        },
        mName: {
            value: "",
            error: false,
        },
        lName: {
            value: "",
            error: false,
        },
        birth: {
            value: "",
            error: false,
        },
    });

    const submit = useCallback(() => {
        let hasError = false;

        Object.keys(formState).map((key) => {
            if (!formState[key as keyof AuthModalFormData].value) {
                setFormState((state) => ({
                    ...state,
                    [key]: {
                        value: "",
                        error: true,
                    },
                }));
                hasError = true;
            }
        });

        if (!hasError) {
            props.onSubmit(formState);
        }
    }, [formState, props.onSubmit]);

    return (
        <Modal
            open={props.isOpened}
            centered
            width={764}
            closable
            onCancel={props.onClose}
            modalRender={() => (
                <div className={className("modal")}>
                    <div className={className("close")}>
                        <Button mode="icon" onClick={props.onClose}>
                            <CloseOutlined />
                        </Button>
                    </div>
                    <div className={className("title")}>
                        Давайте познакомимся поближе
                    </div>
                    <div className={className("description")}>
                        Благодаря вашим данным, мы сможем более тщательно
                        подобрать подходящие занятия
                    </div>
                    <img className={className("image")} src={img} />
                    <Input
                        placeholder="Фамилия"
                        className={className("input")}
                        value={formState.lName.value}
                        status={formState.lName.error ? "error" : ""}
                        onChange={(e) =>
                            setFormState((state) => ({
                                ...state,
                                lName: {
                                    value: e.target.value,
                                    error: false,
                                },
                            }))
                        }
                    />
                    <Input
                        placeholder="Имя"
                        className={className("input")}
                        value={formState.fName.value}
                        status={formState.fName.error ? "error" : ""}
                        onChange={(e) =>
                            setFormState((state) => ({
                                ...state,
                                fName: {
                                    value: e.target.value,
                                    error: false,
                                },
                            }))
                        }
                    />
                    <Input
                        placeholder="Отчество"
                        className={className("input")}
                        value={formState.mName.value}
                        status={formState.mName.error ? "error" : ""}
                        onChange={(e) =>
                            setFormState((state) => ({
                                ...state,
                                mName: {
                                    value: e.target.value,
                                    error: false,
                                },
                            }))
                        }
                    />
                    <DatePicker
                        placeholder="Дата рождения"
                        className={className("input")}
                        status={formState.birth.error ? "error" : ""}
                        onChange={(_value, dateString) =>
                            setFormState((state) => ({
                                ...state,
                                birth: {
                                    value: dateString,
                                    error: false,
                                },
                            }))
                        }
                    />
                    <Button size="l" mode="active" onClick={submit}>
                        Отправить
                    </Button>
                </div>
            )}
        />
    );
};

export default AuthModal;
