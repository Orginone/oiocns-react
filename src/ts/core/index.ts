import { Emitter } from '../base/common';
import { XMarket, XTarget } from '../base/schema';
import { Market } from './market';
import Person from './target/person';

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
export { msgNotify } from './target/chat/chat';
export type { IChat } from './target/chat/ichat';
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
export type { IFileSystemItem, TaskModel } from './target/store/ifilesys';
export { findTargetShare } from './target/targetMap';
export type { INullSpeciesItem, ISpeciesItem } from './target/thing';
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

export const createPerson = (data: XTarget) => {
  return new Person(data);
};

export const createMarket = (data: XMarket) => {
  return new Market(data);
};

export const emitter = new Emitter();
