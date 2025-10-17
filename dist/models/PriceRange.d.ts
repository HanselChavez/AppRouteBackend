import { Document } from "mongoose";
interface IPriceRange extends Document {
    name: string;
    minPrice: number;
    maxPrice: number;
}
declare const PriceRange: import("mongoose").Model<IPriceRange, {}, {}, {}, Document<unknown, {}, IPriceRange> & IPriceRange & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export { PriceRange, IPriceRange };
