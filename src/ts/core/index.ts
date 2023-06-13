export { ChatMessage } from './chat/message/chatmsg';
export type { IMessage, IMessageLabel } from './chat/message/message';
export type { IMsgChat } from './chat/message/msgchat';
export { msgChatNotify } from './chat/message/msgchat';
export type { IEntity } from './public';
export { companyTypes, departmentTypes, orgAuth, valueTypes } from './public/consts';
export {
  MessageType,
  SpeciesType,
  TargetType,
  TaskStatus,
  ValueType,
} from './public/enums';
export type { IAuthority } from './target/authority/authority';
export type { IBelong } from './target/base/belong';
export type { ITarget } from './target/base/target';
export type { ITeam } from './target/base/team';
export type { IIdentity } from './target/identity/identity';
export type { IDepartment } from './target/innerTeam/department';
export type { IStation } from './target/innerTeam/station';
export type { ICohort } from './target/outTeam/cohort';
export type { IGroup } from './target/outTeam/group';
export type { IPerson } from './target/person';
export type { ICompany } from './target/team/company';
export { UserProvider } from './user';
