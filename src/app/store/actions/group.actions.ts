import { createAction, props } from '@ngrx/store';
import { Group } from '../models/group';

export const AddGroupAction = createAction(
  '[GROUP] Add GROUP',
  props<{ payload: Group }>()
);
