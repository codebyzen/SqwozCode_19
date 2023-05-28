export const useClassname = (block: string) => {
    return (opts?: string | Record<string, string | undefined | boolean>) => {
        if (!opts) {
            return block;
        }

        if (typeof opts === "string") {
            return `${block}__${opts}`;
        }

        return [
            block,
            ...Object.keys(opts)
                .filter((key) => opts[key])
                .map((key) => `${block}_${key}_${opts[key]}`),
        ].join(" ");
    };
};
