import { getUuid } from '@/utils/tools';
import { ElementInit } from './ElementTreeManager';
import { PageElement } from './PageElement';
import { ElementMeta } from './ElementMeta';
import _ from 'lodash';

export type ElementDefaults<E extends PageElement> = {
  props: E['props'];
  slots: Required<E['slots']>;
};

export default class ElementFactory {
  // TODO: 注册和解析元素属性元数据，包括默认值和校验
  readonly elementMeta: Dictionary<ElementMeta>;

  constructor(meta: Dictionary<ElementMeta>) {
    this.elementMeta = meta;
  }

  getMeta(kind: string): ElementMeta | null {
    return this.elementMeta[kind] ?? null;
  }

  getDefaultsFromMeta<E extends PageElement>(kind: E['kind']): ElementDefaults<E> {
    const meta = this.getMeta(kind);
    if (!meta) {
      return {
        props: {},
        slots: {},
      } as any;
    }

    const props: Dictionary<any> = {};
    for (const [prop, value] of Object.entries(meta.props)) {
      if (value.default != undefined) {
        props[prop] = _.cloneDeep(value.default);
      }
    }

    const slots: Dictionary<any> = {};
    for (const [slot, value] of Object.entries(meta.slots || {})) {
      if (value.single) {
        if (value.default) {
          slots[slot] = this.create(value.default, value.label ?? '');
        } else {
          slots[slot] = null;
        }
      } else {
        slots[slot] = [];
        if (value.default) {
          for (const item of value.default) {
            slots[slot].push(this.create(item, value.label ?? ''));
          }
        }
      }
    }

    return {
      props,
      slots,
    } as any;
  }

  create<E extends PageElement>(
    kind: E['kind'],
    name: string,
    params: ElementInit<E> = {},
  ): E {
    const newProps = params.props;
    const newSlots = params.slots;
    params = _.omit(params, ['props', 'slots']);

    const defaults = this.getDefaultsFromMeta<E>(kind);
    if (newProps) {
      Object.assign(defaults.props, newProps);
    }
    if (newSlots) {
      Object.assign(defaults.slots, newSlots);
    }

    const e: E = {
      id: getUuid(),
      kind,
      name,
      ...defaults,
      ...params,
    } as any;

    e.children = [];
    return e;
  }
}
