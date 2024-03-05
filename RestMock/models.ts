export interface Response<T = void> {
  statusCode: number;
  error?: string;
  data?: T;
}

export interface UserData {
  name: string;
  age: number;
}

export interface PollingProgress {
  status: string;
  state: number;
}
