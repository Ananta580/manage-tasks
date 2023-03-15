import { Group } from './group';
import { Task } from './tasks';

export interface State {
  readonly task: Array<Task>;
  readonly group: Array<Group>;
}
