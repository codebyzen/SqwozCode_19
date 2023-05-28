import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthModal, { AuthModalFormData } from "../components/auth-modal";
import useApiClient from "../libs/api-client";
import { useUserSession } from "../libs/user-session";
import {
    isAuthModalOpened,
    // setSurveyResult,
    setUser,
    toggleAuthModal,
} from "../store/user-slice";

const AuthModalContainer = () => {
    const apiClient = useApiClient();
    const dispatch = useDispatch();

    const { needAuth, userId, rejectAuth, saveUserId } = useUserSession();

    const isOpened = useSelector(isAuthModalOpened);

    const handleSubmit = useCallback(async (data: AuthModalFormData) => {
        const response = await apiClient.createUser({
            fName: data.fName.value,
            mName: data.mName.value,
            lName: data.lName.value,
            birth: data.birth.value,
        });

        saveUserId(response.id);
        dispatch(setUser({ id: response.id }));

        dispatch(toggleAuthModal(false));
    }, []);

    useEffect(() => {
        // const loadUser = async (id: string) => {
        //     const data = await apiClient.getUser(id);

        //     dispatch(setUser({ id: data.id }));
        //     if (data.cluster) {
        //         dispatch(setSurveyResult(data.cluster));
        //     }
        // };

        if (needAuth) {
            dispatch(toggleAuthModal(true));
        }
        if (userId) {
            dispatch(setUser({ id: userId }));
        }
    }, [needAuth, userId]);

    const handleClose = useCallback(() => {
        rejectAuth();
        dispatch(toggleAuthModal(false));
    }, []);

    return (
        <AuthModal
            isOpened={isOpened}
            onSubmit={handleSubmit}
            onClose={handleClose}
        />
    );
};

export default AuthModalContainer;
