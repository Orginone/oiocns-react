import Person from '@/ts/core/target/person';

/* eslint-disable no-unused-vars */
interface InfoProps {
  userId: string;
  username: string;
  phone: string;
  desc: string;
}

// 用户
interface UserType {
  accessToken?: string;
  account?: string;
  authority: string;
  expiresIn: number;
  license: string;
  motto: string;
  tokenType: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
  [key: string]: any;
}

interface MenuProps {
  id: string;
  path: string;
  title: string;
}

// 类型声明
export type StateProps = {
  /**@name 用户信息 */
  user: Partial<UserType>;

  /**@name 数据列表 */
  list: any[];

  /**@name loading */
  loading: boolean;

  /**@name 个人空间 */
  userSpace: SpaceType;

  /**@name 当前修改项 */
  editItem: any;
  /**@name 当前用户的person类实例 */
  userObj: Person | null;

  login: (account: string, password: string) => Promise<boolean>;
  setUser: (val: Partial<UserType>) => void;
  getUserInfo: () => void;
};
