import { Action, createReducer, on } from '@ngrx/store';
import {
  AddGroupAction,
  DeleteGroupAction,
  EditGroupAction,
} from '../actions/group.actions';
import { Group } from '../models/group';

const initialState: Array<Group> = JSON.parse(
  localStorage.getItem('groups') ?? '[]'
);

const reducer = createReducer(
  initialState,
  on(AddGroupAction, (state, action) => {
    localStorage.setItem('groups', JSON.stringify([...state, action.payload]));
    return [...state, action.payload];
  }),
  on(EditGroupAction, (state, action) => {
    var newState = state.map((data) => {
      if (data.id === action.payload.id) {
        return { ...action.payload };
      }
      return data;
    });
    localStorage.setItem('groups', JSON.stringify([...newState]));
    return [...newState];
  }),
  on(DeleteGroupAction, (state, action) => {
    let newState = [...state];
    newState.splice(
      state.findIndex((x) => x.id == action.payload),
      1
    );
    localStorage.setItem('groups', JSON.stringify([...newState]));
    return [...newState];
  })
);

export function GroupReducer(state: Array<Group> | undefined, action: Action) {
  return reducer(state, action);
}
