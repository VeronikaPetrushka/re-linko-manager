import Background from "../ReShare/Background";

import ReloaderLinko from "../ReDistribution/ReloaderLinko";
import RenewlinkLinko from "../ReDistribution/RenewlinkLinko";
import RemylinksLinko from "../ReDistribution/RemylinksLinko";

export const ReloaderLinkoF = () => {
    return (
        <ReloaderLinko />
    )
};

export const RenewlinkLinkoF = () => {
    return (
        <Background dis={<RenewlinkLinko />} nav />
    )
};

export const RemylinksLinkoF = () => {
    return (
        <Background dis={<RemylinksLinko />} />
    )
};