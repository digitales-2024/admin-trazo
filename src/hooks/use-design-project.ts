import { useGetDesignProjectsQuery } from "@/redux/services/designProjectApi";

export const useDesignProject = () => {
    const { data, isLoading, error } = useGetDesignProjectsQuery();

    return {
        data,
        isLoading,
        error,
    }
}

