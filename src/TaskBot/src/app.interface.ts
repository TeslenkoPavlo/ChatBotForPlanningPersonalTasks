import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?:
      | 'completeTask'
      | 'editTask'
      | 'deleteTask'
      | 'createTask'
      | 'deleteAll'
      | 'markAllComplete'
      | 'markAllPending'
      | null;
    editTaskId?: number;
  };
}
