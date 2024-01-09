import { model } from '@/ts/base';
import { deepClone } from '@/ts/base/common';
import { Executor } from '.';
import { FormData } from './index';

/**
 * 字段变更
 */
export class FieldsChange extends Executor {
  /**
   * 执行
   * @param data 表单数据
   */
  async execute(data: FormData): Promise<boolean> {
    const instance = this.task.instanceData;
    if (instance) {
      for (const change of this.metadata.changes) {
        for (const form of instance.node.forms) {
          if (change.id == form.id) {
            const editData: model.FormEditData[] = instance.data[change.id];
            if (editData && editData.length > 0) {
              const edit = deepClone(editData[editData.length - 1]);
              edit.after.forEach((item) => {
                for (const fieldChange of change.fieldChanges) {
                  if (fieldChange.before) {
                    if (item[fieldChange.id] != fieldChange.before) {
                      throw new Error(
                        `当前字段${fieldChange.name}不为${fieldChange.beforeName}，变更失败`,
                      );
                    }
                  }
                  item[fieldChange.id] = fieldChange.after;
                }
              });
              data.set(change.id, edit);
            }
          }
        }
      }
    }
    return false;
  }
}
