import { kernel, model, schema } from '../../../base';
import { SpeciesType } from '../../public';
import { PageAll } from '../../public/consts';
import { ITarget } from '../../target/base/target';
import { ISpeciesItem, SpeciesItem } from '../base/species';
import { Dict, IDict } from './dict';

/** 字典分类的抽象接口 */
export interface IDictClass extends ISpeciesItem {
  /** 字典 */
  dicts: IDict[];
  /** 加载所有字典 */
  loadAllDicts(): Promise<IDict[]>;
  /** 加载元数据字典 */
  loadDicts(reload?: boolean): Promise<IDict[]>;
  /** 添加字典 */
  createDict(data: model.DictModel): Promise<IDict | undefined>;
}

/** 字典分类的基类实现 */
export class DictClass extends SpeciesItem implements IDictClass {
  constructor(_metadata: schema.XSpecies, _current: ITarget, _parent?: IDictClass) {
    super(_metadata, _current, _parent);
    if (_parent && _parent.dicts) {
      this.dicts.push(..._parent.dicts);
    }
    this.speciesTypes = [_metadata.typeName];
  }
  dicts: IDict[] = [];
  private _dictLoaded: boolean = false;
  async loadAllDicts(): Promise<IDict[]> {
    const dicts: IDict[] = [];
    dicts.push(...(await this.loadDicts()));
    for (const item of this.children) {
      const subDicts = await (item as IDictClass).loadAllDicts();
      for (const sub of subDicts) {
        if (dicts.findIndex((i) => i.id === sub.id) < 0) {
          dicts.push(sub);
        }
      }
    }
    return dicts;
  }
  async loadDicts(reload: boolean = false): Promise<IDict[]> {
    if (!this._dictLoaded || reload) {
      const res = await kernel.queryDicts({
        id: this.id,
        page: PageAll,
      });
      if (res.success) {
        this._dictLoaded = true;
        this.dicts = (res.data.result || []).map((item) => {
          return new Dict(item, this);
        });
      }
    }
    return this.dicts;
  }
  async createDict(data: model.DictModel): Promise<IDict | undefined> {
    data.speciesId = this.id;
    const res = await kernel.createDict(data);
    if (res.success && res.data?.id) {
      const dict = new Dict(res.data, this);
      this.dicts.push(dict);
      return dict;
    }
  }
  override createChildren(
    _metadata: schema.XSpecies,
    _current: ITarget,
  ): ISpeciesItem | undefined {
    switch (_metadata.typeName) {
      case SpeciesType.Dict:
        return new DictClass(_metadata, this.current, this);
    }
  }
  _propertyChanged(type: string, props: IDict[]) {
    if (this._dictLoaded) {
      for (const item of props) {
        switch (type) {
          case 'deleted':
            this.dicts = this.dicts.filter((i) => i.id != item.id);
            break;
          case 'added':
            this.dicts.push(item);
            break;
          case 'updated':
            {
              const index = this.dicts.findIndex((i) => i.id === item.id);
              if (index > -1) {
                this.dicts[index] = item;
              }
            }
            break;
        }
      }
      for (const item of this.children) {
        (item as DictClass)._propertyChanged(type, props);
      }
    }
  }
}
