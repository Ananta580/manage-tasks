import { Action, createReducer, on } from '@ngrx/store';
import {
  AddTaskAction,
  DeleteTaskAction,
  EditTaskAction,
} from '../actions/tasks.actions';
import { Task } from '../models/tasks';

const initialState: Array<Task> = JSON.parse(
  localStorage.getItem('tasks') ?? '[]'
);

const reducer = createReducer(
  initialState,
  on(AddTaskAction, (state, action) => {
    localStorage.setItem('tasks', JSON.stringify([...state, action.payload]));
    return [...state, action.payload];
  }),
  on(EditTaskAction, (state, action) => {
    console.log(action.payload.id);

    var newState = state.map((data) => {
      if (data.id === action.payload.id) {
        return { ...action.payload };
      }
      return data;
    });
    localStorage.setItem('tasks', JSON.stringify([...newState]));
    return [...newState];
  }),
  on(DeleteTaskAction, (state, action) => {
    let newState = [...state];
    newState.splice(
      state.findIndex((x) => x.id == action.payload),
      1
    );
    localStorage.setItem('tasks', JSON.stringify([...newState]));
    return [...newState];
  })
);

export function TaskReducer(state: Array<Task> | undefined, action: Action) {
  return reducer(state, action);
}
