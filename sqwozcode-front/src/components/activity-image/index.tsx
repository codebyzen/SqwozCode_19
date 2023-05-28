import React, { FC } from "react";
import { getClusterPicture } from "./pictures";

interface ActivityImageProps {
    className: string;
    clusterId?: string;
}

const ActivityImage: FC<ActivityImageProps> = ({ className, clusterId }) => {
    return <img className={className} src={getClusterPicture(clusterId)} />;
};

export default ActivityImage;
