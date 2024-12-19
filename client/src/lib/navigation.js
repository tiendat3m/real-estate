import { postRentTypes, postSoldTypes } from "./constants"
import { pathnames } from "./pathname"


const navigations = [
    {
        id: 1,
        name: "Nhà đất bán",
        pathname: pathnames.publics.soldProperty,
        hasSub: true,
        subs: postSoldTypes
    },
    {
        id: 2,
        name: "Nhà đất cho thuê",
        pathname: pathnames.publics.rentProperty,
        hasSub: true,
        subs: postRentTypes
    },
    {
        id: 3,
        name: "Tin tức",
        pathname: pathnames.publics.news,
        hasSub: false,
    },
]

export default navigations