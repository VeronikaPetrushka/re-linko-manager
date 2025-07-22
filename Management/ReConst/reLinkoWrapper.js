import Background from "../ReShare/Background";

import ReloaderLinko from "../ReDistribution/ReloaderLinko";
import RenewlinkLinko from "../ReDistribution/RenewlinkLinko";
import RemylinksLinko from "../ReDistribution/RemylinksLinko";
import ReopenfolderLinko from "../ReDistribution/ReopenfolderLinko";
import RecollectionsLinko from "../ReDistribution/RecollectionsLinko";
import RenewgroupLinko from "../ReDistribution/RenewgroupLinko";
import ReremindersLinko from "../ReDistribution/ReremindersLinko";
import ResettingsLinko from "../ReDistribution/ResettingsLinko";
import ReclearingLinko from "../ReDistribution/ReclearingLinko";
import RemanagetagLinko from "../ReDistribution/RemanagetagLinko";

export const ReloaderLinkoF = () => {
    return (
        <ReloaderLinko />
    )
};

export const RenewlinkLinkoF = () => {
    return (
        <Background dis={<RenewlinkLinko />} />
    )
};

export const RemylinksLinkoF = () => {
    return (
        <Background dis={<RemylinksLinko />} nav />
    )
};

export const RecollectionsLinkoF = () => {
    return (
        <Background dis={<RecollectionsLinko />} nav />
    )
};

export const ReopenfolderLinkoF = ({ route }) => {
    const { group } = route.params;

    return (
        <Background dis={<ReopenfolderLinko group={group} />} />
    )
};

export const RenewgroupLinkoF = () => {
    return (
        <Background dis={<RenewgroupLinko />} />
    )
};

export const ReremindersLinkoF = () => {
    return (
        <Background dis={<ReremindersLinko />} nav />
    )
};

export const ResettingsLinkoF = () => {
    return (
        <Background dis={<ResettingsLinko />} nav />
    )
};

export const ReclearingLinkoF = () => {
    return (
        <Background dis={<ReclearingLinko />} />
    )
};

export const RemanagetagLinkoF = () => {
    return (
        <Background dis={<RemanagetagLinko />} />
    )
};