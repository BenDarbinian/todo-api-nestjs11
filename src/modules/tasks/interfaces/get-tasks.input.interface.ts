export interface GetTasksInput {
  limit: number;
  page: number;
  skip: number;
  userId?: number;
  isParent: boolean;
  relations?: string[];
}
