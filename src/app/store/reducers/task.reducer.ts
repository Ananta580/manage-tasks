import { Action, createReducer, on } from '@ngrx/store';
import {
  AddTaskAction,
  DeleteTaskAction,
  EditTaskAction,
  ReorderTaskAction,
  searchTaskAction,
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
    var newState = state.map((data) => {
      if (data.id === action.payload.id) {
        return { ...action.payload };
      }
      return data;
    });
    localStorage.setItem('tasks', JSON.stringify([...newState]));
    return [...newState];
  }),
  on(ReorderTaskAction, (state, action: any) => {
    var prev = action.payload[0];
    var current = action.payload[1];
    var newState = state.map((data) => {
      if (data.id === prev.id) {
        return { ...prev };
      }
      if (data.id === current.id) {
        return { ...current };
      }
      return data;
    });
    localStorage.setItem('tasks', JSON.stringify([...newState]));
    return [...newState];
  }),
  on(searchTaskAction, (state, action: any) => {
    var searchString = action.payload;
    const backup: Task[] =
      JSON.parse(localStorage.getItem('tasks') ?? '[]') ?? [];
    const filtered = backup.filter(
      (x) =>
        x.description?.toLowerCase().includes(searchString) ||
        x.title?.toLowerCase().includes(searchString) ||
        x.group?.name.toLowerCase().includes(searchString)
    );

    return [...filtered];
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
