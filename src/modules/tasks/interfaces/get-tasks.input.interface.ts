export interface GetTasksInput {
  limit?: number;
  page?: number;
  skip?: number;
  date?: string;
  userId?: number;
  parentId?: number;
  isParent?: boolean;
  relations?: string[];
}
