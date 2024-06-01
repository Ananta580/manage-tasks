import { createAction, props } from '@ngrx/store';
import { Task } from '../models/tasks';

export const AddTaskAction = createAction(
  '[TASK] Add TASK',
  props<{ payload: Task }>()
);

export const EditTaskAction = createAction(
  '[TASK] Edit TASK',
  props<{ payload: Task }>()
);

export const ReorderTaskAction = createAction(
  '[TASK] Reorder TASK',
  props<{ payload: Array<Task> }>()
);

export const searchTaskAction = createAction(
  '[TASK] Serch TASK',
  props<{ payload: string }>()
);

export const DeleteTaskAction = createAction(
  '[TASK] Delete TASK',
  props<{ payload: number }>()
);
