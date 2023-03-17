import { createAction, props } from '@ngrx/store';
import { Group } from '../models/group';

export const AddGroupAction = createAction(
  '[GROUP] Add GROUP',
  props<{ payload: Group }>()
);

export const EditGroupAction = createAction(
  '[GROUP] Edit GROUP',
  props<{ payload: Group }>()
);

export const DeleteGroupAction = createAction(
  '[GROUP] Delete GROUP',
  props<{ payload: number }>()
);
