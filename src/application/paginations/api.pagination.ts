export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  list: T[];
  pagination: ApiPagination;
}