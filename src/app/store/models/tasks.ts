export interface Task {
  id: number;
  order: number;
  title: string;
  done: boolean;
  description?: string;
  date: string;
  group: any;
  animate?: boolean;
}
