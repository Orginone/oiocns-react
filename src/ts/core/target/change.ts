import { kernel, schema } from '../../base';

export interface IChangeNotity {
  notity(
    data: any,
    ignoreSelf?: boolean,
    targetId?: string,
    onlyTarget?: boolean,
    onlineOnly?: boolean,
  ): Promise<boolean>;
}

export class ChangeNotity implements IChangeNotity {
  flag: string;
  target: schema.XTarget;
  relations: string[];
  constructor(
    _target: schema.XTarget,
    _relations: string[],
    _flag: string,
    _callBack: (...args: any[]) => any,
  ) {
    this.flag = _flag;
    this.target = _target;
    this.relations = _relations;
    kernel.on(`${_target.belongId}-${_target.id}-${_flag}`, _callBack);
  }
  async notity(
    data: any,
    ignoreSelf?: boolean,
    targetId?: string,
    onlyTarget?: boolean,
    onlineOnly: boolean = true,
  ): Promise<boolean> {
    const res = await kernel.dataNotify({
      data: data,
      flag: this.flag,
      onlineOnly: onlineOnly,
      belongId: this.target.belongId,
      relations: this.relations,
      onlyTarget: onlyTarget === true,
      ignoreSelf: ignoreSelf === true,
      targetId: targetId ?? this.target.id,
    });
    return res.success;
  }
}
