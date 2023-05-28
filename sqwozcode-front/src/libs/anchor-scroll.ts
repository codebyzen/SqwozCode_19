import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useAnchorScroll = () => {
    const { pathname, hash, key } = useLocation();

    useEffect(() => {
        if (hash !== "") {
            setTimeout(() => {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({
                        block: "start",
                        behavior: "smooth",
                    });
                }
            }, 0);
        }
    }, [pathname, hash, key]);
};
