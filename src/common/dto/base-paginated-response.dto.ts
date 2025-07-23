export class BasePaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
}
