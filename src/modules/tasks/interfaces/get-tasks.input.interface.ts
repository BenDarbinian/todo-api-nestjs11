export interface GetTasksInput {
  limit?: number;
  page?: number;
  skip?: number;
  userId?: number;
  parentId?: number;
  isParent?: boolean;
  relations?: string[];
}
