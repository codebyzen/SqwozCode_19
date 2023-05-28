import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
    id: string;
}

interface UserState {
    data?: {
        id: string;
    };
    surveyResult?: string;
    isAuthModalOpened: boolean;
}

const initialState: UserState = {
        isAuthModalOpened: false,
    },
    userSlice = createSlice({
        name: "user",
        initialState,
        reducers: {
            toggleAuthModal: (state, action: PayloadAction<boolean>) => {
                state.isAuthModalOpened = action.payload;
            },
            setUser: (state, action: PayloadAction<UserData>) => {
                state.data = action.payload;
            },
            setSurveyResult: (state, action: PayloadAction<string>) => {
                state.surveyResult = action.payload;
            },
        },
    });

const selectors = {
    isAuthModalOpened: (state: { user: UserState }) =>
        state.user.isAuthModalOpened,
    getUser: (state: { user: UserState }) => state.user.data,
    getSurveyResult: (state: { user: UserState }) => state.user.surveyResult,
};

export const { setUser, toggleAuthModal, setSurveyResult } = userSlice.actions;
export const { getUser, isAuthModalOpened, getSurveyResult } = selectors;

export default userSlice.reducer;
