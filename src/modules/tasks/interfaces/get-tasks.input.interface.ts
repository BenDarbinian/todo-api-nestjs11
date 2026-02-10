export interface GetTasksInput {
  limit?: number;
  page?: number;
  skip?: number;
  date?: string;
  completed?: boolean;
  userId?: number;
  parentId?: number;
  isParent?: boolean;
  relations?: string[];
}
