/* eslint-disable no-unused-vars */

import { TargetType } from './enum';

export interface Mixin {
  id: string;
  name: string;
  code: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
}

export interface TTeam extends Mixin {
  targetId: string;
  remark: string;
  target: TTarget | undefined;
}

export interface TTarget extends Mixin {
  typeName: TargetType;
  thingId: string;
  belongId: string;
  team: TTeam | undefined;
}
