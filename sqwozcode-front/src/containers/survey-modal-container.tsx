import React, { FC } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SurveyModal from "../components/survey-modal";
import useApiClient from "../libs/api-client";
import { getUser, setSurveyResult } from "../store/user-slice";

const questionsConfig = {
    "0": {
        text: "Важна ли для вас регулярная физическая активность?",
        answers: [
            {
                id: "0",
                text: "Да",
                nextQuestion: "1",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "5",
            },
        ],
    },
    "1": {
        text: "Мечтали ли Вы в детстве стать спортсменом?",
        answers: [
            {
                id: "0",
                text: "Да",
                nextQuestion: "2",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "3",
            },
        ],
    },
    "2": {
        text: "Любите ли Вы соревноваться?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "10",
            },
            {
                id: "1",
                text: "Нет",
                result: "12",
            },
        ],
    },
    "3": {
        text: "Согласны ли Вы с фразой «Движение — это жизнь»?",
        answers: [
            {
                id: "0",
                text: "Да",
                nextQuestion: "4",
            },
            {
                id: "1",
                text: "Нет",
                result: "8",
            },
        ],
    },
    "4": {
        text: "Вы любите танцевать?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "1",
            },
            {
                id: "1",
                text: "Нет",
                result: "14",
            },
        ],
    },
    "5": {
        text: "Увлекаетесь ли Вы искусством?",
        answers: [
            {
                id: "0",
                text: "Да",
                nextQuestion: "6",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "9",
            },
        ],
    },
    "6": {
        text: "Интересно ли Вам узнавать исторические факты?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "13",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "7",
            },
        ],
    },
    "7": {
        text: "Любите ли Вы музыку?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "3",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "8",
            },
        ],
    },
    "8": {
        text: "Любите ли Вы создавать что-то своми руками?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "0",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "ТЕАТР, КИНО, ЛИТЕРАТУРА",
            },
        ],
    },
    "9": {
        text: "Любите ли Вы получать новые знания?",
        answers: [
            {
                id: "0",
                text: "Да",
                nextQuestion: "10",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "13",
            },
        ],
    },
    "10": {
        text: "Хотели бы Вы изучить иностранный язык?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "2",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "11",
            },
        ],
    },
    "11": {
        text: "Интересно ли Вам узнать больше о современных технологиях?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "5",
            },
            {
                id: "1",
                text: "Нет",
                nextQuestion: "12",
            },
        ],
    },
    "12": {
        text: "Хотели бы Вы лучше разбираться в психологии людей?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "4",
            },
            {
                id: "1",
                text: "Нет",
                result: "15",
            },
        ],
    },
    "13": {
        text: "Интересно ли Вам заниматься созданием домашнего уюта?",
        answers: [
            {
                id: "0",
                text: "Да",
                result: "9",
            },
            {
                id: "1",
                text: "Нет",
                result: "17",
            },
        ],
    },
};

const SurveyModalContainer: FC<{
    isOpened: boolean;
    onClose: () => void;
}> = ({ isOpened, onClose }) => {
    const apiClient = useApiClient();
    const dispatch = useDispatch();
    const user = useSelector(getUser);

    const handleSubmit = useCallback(
        async (id: string) => {
            if (user) {
                await apiClient.saveSurveyResult(id, user.id);
                dispatch(setSurveyResult(id));
                onClose();
            }
        },
        [user]
    );

    return (
        <SurveyModal
            isOpened={isOpened}
            data={questionsConfig}
            onClose={onClose}
            onResult={handleSubmit}
        />
    );
};

export default SurveyModalContainer;
