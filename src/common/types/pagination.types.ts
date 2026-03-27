export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  list: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
