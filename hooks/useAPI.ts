import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import api from '~/services/httpRequests';

const useQueryData = <T>(
  queryKey: string,
  endpoint: string,
  searchParams?: string,
  options?: UseQueryOptions<T, Error>
) => {
  return useQuery<T, Error>({
    queryKey: [queryKey, { searchParams }],
    queryFn: () => api.get<T>(endpoint, { searchParams }),
    ...options,
  });
};

const useMutateData = <T, Variables = void>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE',
  options?: UseMutationOptions<T, Error, Variables>
) => {
  const mutationFn = async (variables: Variables) => {
    switch (method) {
      case 'POST':
        return api.post<T>(endpoint, { body: variables });
      case 'PUT':
        return api.put<T>(endpoint, { body: variables });
      case 'DELETE':
        return api.delete<T>(endpoint, { body: variables });
    }
  };

  return useMutation<T, Error, Variables>({
    mutationFn,
    ...options,
  });
};

export { useMutateData, useQueryData };

// export default useData;

// const useApi = (resource: string) => {
//   const queryClient = useQueryClient();

//   const getAll = <T>(page = 1, limit = 10) =>
//     useQuery([resource, { page, limit }], () => apiService.getAll(resource, page, limit), {
//       keepPreviousData: true,
//     });

//   const getById = (id: string) =>
//     useQuery([resource, id], () => apiService.getById(resource, id), {
//       enabled: !!id,
//     });

//   const create = useMutation((item: any) => apiService.create(resource, item), {
//     onSuccess: () => queryClient.invalidateQueries(resource),
//   });

//   const update = useMutation((item: any) => apiService.update(resource, item), {
//     onSuccess: () => queryClient.invalidateQueries(resource),
//   });

//   const remove = useMutation((id: string) => apiService.delete(resource, id), {
//     onSuccess: () => queryClient.invalidateQueries(resource),
//   });

//   return {
//     getAll,
//     getById,
//     create: create.mutate,
//     update: update.mutate,
//     remove: remove.mutate,
//   };
// };

// export default useApi;
