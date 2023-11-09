import { FC } from 'react';

export interface IExistTypeProps<T = string> {
  prop?: string;
  value?: T;
  onChange: (value?: T | undefined) => any;
}

export type IExistTypeEditor<T = string, P extends {} = {}> = FC<IExistTypeProps<T> & P>;
