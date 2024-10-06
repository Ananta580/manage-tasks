export interface Task {
  id: any;
  uid: any;
  order: number;
  title: string;
  done: boolean;
  description?: string;
  date: string;
  group: any;
  animate?: boolean;
}
