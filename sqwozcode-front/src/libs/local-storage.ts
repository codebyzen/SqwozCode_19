export const useLocalStorage = () => {
    return {
        getLs: (key: string) => {
            return localStorage.getItem(key);
        },
        setLs: (key: string, value: string) => {
            return localStorage.setItem(key, value);
        },
        deleteLs: (key: string) => {
            return localStorage.removeItem(key);
        },
    };
};
