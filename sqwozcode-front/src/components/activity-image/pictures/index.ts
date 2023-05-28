import cluster0 from "./0.svg";
import cluster1 from "./1.svg";
import cluster2 from "./2.svg";
import cluster3 from "./3.svg";
import cluster4 from "./4.svg";
import cluster5 from "./5.svg";
import cluster6 from "./6.svg";
import cluster7 from "./7.svg";
import cluster8 from "./8.svg";
import cluster9 from "./9.svg";
import cluster10 from "./10.svg";
import cluster11 from "./11.svg";
import cluster12 from "./12.svg";
import cluster13 from "./13.svg";
import cluster14 from "./14.svg";
import cluster15 from "./15.svg";
import cluster16 from "./16.svg";
import cluster17 from "./17.svg";
import stub from "./stub.svg";

const getClusterPicture = (id?: string): string => {
    if (!id) {
        return stub;
    }

    return (
        {
            "0": cluster0,
            "1": cluster1,
            "2": cluster2,
            "3": cluster3,
            "4": cluster4,
            "5": cluster5,
            "6": cluster6,
            "7": cluster7,
            "8": cluster8,
            "9": cluster9,
            "10": cluster10,
            "11": cluster11,
            "12": cluster12,
            "13": cluster13,
            "14": cluster14,
            "15": cluster15,
            "16": cluster16,
            "17": cluster17,
        }[id] || stub
    );
};

export { getClusterPicture };
