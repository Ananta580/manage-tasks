import { Action, createReducer, on } from '@ngrx/store';
import { AddGroupAction } from '../actions/group.actions';
import { Group } from '../models/group';

const initialState: Array<Group> = JSON.parse(
  localStorage.getItem('groups') ?? '[]'
);

const reducer = createReducer(
  initialState,
  on(AddGroupAction, (state, action) => {
    localStorage.setItem('groups', JSON.stringify([...state, action.payload]));
    return [...state, action.payload];
  })
);

export function GroupReducer(state: Array<Group> | undefined, action: Action) {
  return reducer(state, action);
}
