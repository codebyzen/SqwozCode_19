export const firstLetterToUpperCase = (str: string) => {
    return str
        .split("")
        .map((_, i) => (!i ? _.toUpperCase() : _))
        .join("");
};
