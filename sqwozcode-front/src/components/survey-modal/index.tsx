import React, { FC } from "react";
import { useClassname } from "../../libs/css";
import { Modal, Radio } from "antd";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseOutlined,
} from "@ant-design/icons";

import img from "./img.svg";

import "./styles.scss";
import { useState } from "react";
import Button from "../button";

interface SurveyQuestion {
    text: string;
    answers: Array<{
        id: string;
        text: string;
        nextQuestion?: string;
        result?: string;
    }>;
}

interface SurveyProps {
    isOpened: boolean;
    data: Record<string, SurveyQuestion>;
    onClose: () => void;
    onResult: (id: string) => void;
}

const progressScale = [30, 60, 70, 80, 90, 100];

const SurveyModal: FC<SurveyProps> = ({
    isOpened,
    data,
    onClose,
    onResult,
}) => {
    const className = useClassname("survey-modal");
    const [activeQuestionId, setActiveQuestionId] = useState("0");
    const activeQuestion = data[activeQuestionId];

    const [anserId, setAnswerId] = useState<string>(
        activeQuestion.answers[0].id
    );

    const [answersHistory, setAnswersHistory] = useState<
        Array<{ qId: string; aId: string }>
    >([]);

    const isLastQuestion = data[activeQuestionId].answers.filter(
        (answer) => answer.result
    ).length;

    return (
        <Modal
            open={isOpened}
            centered
            width={700}
            modalRender={() => (
                <div className={className("modal")}>
                    <div className={className("close")}>
                        <Button mode="icon" onClick={onClose}>
                            <CloseOutlined />
                        </Button>
                    </div>
                    <img className={className("image")} src={img} />
                    <div className={className("title")}>
                        {activeQuestion.text}
                    </div>
                    <div className={className("answers")}>
                        {activeQuestion.answers.map((answer) => (
                            <Radio
                                checked={anserId === answer.id}
                                className={className("answer")}
                                onChange={() => {
                                    setAnswerId(answer.id);
                                }}
                            >
                                {answer.text}
                            </Radio>
                        ))}
                    </div>
                    <div className={className("footer")}>
                        <div className={className("buttons")}>
                            {Boolean(answersHistory.length) && (
                                <Button
                                    size="m"
                                    mode="plain"
                                    onClick={() => {
                                        const changedHistory = [
                                            ...answersHistory,
                                        ];
                                        const prev = changedHistory.pop();

                                        if (prev) {
                                            setActiveQuestionId(prev.qId);
                                            setAnswerId(prev.aId);
                                            setAnswersHistory(changedHistory);
                                        }
                                    }}
                                >
                                    <ArrowLeftOutlined /> Назад
                                </Button>
                            )}
                            <Button
                                size="m"
                                mode="plain"
                                onClick={() => {
                                    const currentAnswer =
                                        activeQuestion.answers.find(
                                            (a) => a.id === anserId
                                        );

                                    if (currentAnswer?.nextQuestion) {
                                        setAnswersHistory([
                                            ...answersHistory,
                                            {
                                                qId: activeQuestionId,
                                                aId: anserId,
                                            },
                                        ]);
                                        setActiveQuestionId(
                                            currentAnswer?.nextQuestion
                                        );
                                        setAnswerId(
                                            data[currentAnswer?.nextQuestion]
                                                .answers[0].id
                                        );
                                    }

                                    if (currentAnswer?.result) {
                                        onResult(currentAnswer.result);
                                    }
                                }}
                            >
                                Вперед <ArrowRightOutlined />
                            </Button>
                        </div>
                    </div>
                    <div className={className("progress")}>
                        <div
                            className={className("progress-fill")}
                            style={{
                                width: `${
                                    isLastQuestion
                                        ? 100
                                        : progressScale[answersHistory.length]
                                }%`,
                            }}
                        />
                    </div>
                </div>
            )}
        />
    );
};

export default SurveyModal;
