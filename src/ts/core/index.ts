import { Emitter } from '../base/common';
import { XMarket, XTarget } from '../base/schema';
import { Market } from './market';
import Person from './target/person';

export type { IChat, IChatGroup } from './chat';
export { LoadChats } from './chat';
export {
  AuthorityType,
  CommonStatus,
  DomainTypes,
  MessageType,
  OrderStatus,
  ProductType,
  TargetType,
  WorkType,
} from './enum';
export type { IMarket, IMerchandise, IProduct, IResource } from './market';
export { getFileSysItemRoot } from './store/filesys';
export type { IFileSystemItem, IObjectItem, TaskModel } from './store/ifilesys';
export type {
  ICohort,
  ICompany,
  IDepartment,
  IFlow,
  IGroup,
  IMTarget,
  IPerson,
  ISpace,
  ITarget,
  IWorking,
} from './target/itarget';
export { findTargetShare } from './target/targetMap';
export type { INullSpeciesItem, ISpeciesItem } from './thing';
export { loadSpeciesTree } from './thing';
export type { IApplyItem, IApprovalItem, IOrderApplyItem, ITodoGroup } from './todo';
export {
  loadMarketApply,
  loadMarketTodo,
  loadOrderTodo,
  loadOrgApply,
  loadOrgTodo,
  loadPublishApply,
  loadPublishTodo,
} from './todo';
export type { Dict } from '@/ts/core/thing/dict';
export type { IDict } from '@/ts/core/thing/idict';

export const createPerson = (data: XTarget) => {
  return new Person(data);
};

export const createMarket = (data: XMarket) => {
  return new Market(data);
};

export const emitter = new Emitter();
