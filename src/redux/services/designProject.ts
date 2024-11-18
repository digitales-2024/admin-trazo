import {
    Quotation,
    QuotationStatusType,
    QuotationStructure,
    QuotationSummary,
} from "@/types";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const designProjectApi = createApi({
    reducerPath: "designProjectApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["DesignProject"],
    endpoints: (build) => ({
    }),
})
