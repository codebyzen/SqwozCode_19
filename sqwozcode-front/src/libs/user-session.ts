import { useLocalStorage } from "./local-storage";

const lsUserDataKey = "_sqwozcode_user_data";

export const useUserSession = () => {
    const { getLs, setLs, deleteLs } = useLocalStorage();
    const userData = getLs(lsUserDataKey);

    let id;
    try {
        const userDataJson = userData && JSON.parse(userData);
        id = userDataJson.id;
    } catch (e) {
        // todo: fallback
    }

    return {
        needAuth: !userData,
        userId: id,
        rejectAuth: () => {
            setLs(lsUserDataKey, JSON.stringify({ reject: true }));
        },
        saveUserId: (userId: string) => {
            setLs(lsUserDataKey, JSON.stringify({ id: userId }));
        },
        reset: () => {
            deleteLs(lsUserDataKey);
        },
    };
};
