import { Context } from './context';

export type Route = (context: Context) => Promise<any> | any;