import { XDirectory } from '@/ts/base/schema';
import { IDirectory, XCollection } from '@/ts/core';
import { Node, Sheet, SheetHandler, Tree } from '../impl';
import { DirData, Directory, Error, FormData, IExcel, SpeciesData } from '../type';

export class DirectorySheet extends Sheet<Directory> {
  constructor(dir: IDirectory) {
    super(
      '目录',
      [
        { title: '上级目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
        { title: '目录名称', dataIndex: 'name', valueType: '描述型' },
        { title: '目录代码', dataIndex: 'code', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述性' },
        { title: '上级目录主键', dataIndex: 'directoryId', valueType: '描述性' },
      ],
      dir,
    );
  }

  get coll(): XCollection<XDirectory> {
    return this.dir.resource.directoryColl;
  }
}

export class DirectoryHandler extends SheetHandler<DirectorySheet> {
  /**
   * 数据校验
   * @param data 数据
   */
  checkData() {
    const allErrors: Error[] = [];
    const codeSets = new Set();
    this.sheet.data.forEach((item, index) => {
      let errors = this.assert(index, [
        { res: !item.name, error: '目录名称不能为空！' },
        { res: !item.code, error: '目录代码不能为空！' },
        { res: codeSets.has(item.code), error: '目录代码不能重复！' },
      ]);
      codeSets.add(item.code);
      allErrors.push(...errors);
    });
    if (allErrors.length == 0) {
      const tree = new Tree(
        this.sheet.data,
        (node) => node.code,
        (node) => node.directoryCode,
      );
      tree.freeMap.forEach((item) => {
        const parentCode = item.data.directoryCode;
        allErrors.push(
          ...this.assert(item.index, [
            { res: tree.freeMap.size != 0, error: '未找到上级目录代码：' + parentCode },
          ]),
        );
      });
    }
    return allErrors;
  }
  /**
   * 更新/创建目录
   * @param context 上下文
   */
  async operating(
    excel: IExcel,
    onItemCompleted: (count?: number) => void,
  ): Promise<void> {
    const nTree = new Tree<DirData>(
      this.sheet.data.map((item) => {
        return { meta: item, species: {}, props: {}, forms: {} };
      }),
      (n) => n.meta.code,
      (n) => n.meta.directoryCode,
    );
    const oTree = new Tree(
      await this.dirTree(this.sheet.dir, onItemCompleted, true),
      (n) => n.meta.id.replace('_', ''),
      (n) => n.meta.directoryId,
      { meta: this.sheet.dir.metadata, species: {}, props: {}, forms: {} },
    );
    await this.recursion(
      excel,
      this.sheet.dir.metadata,
      nTree.root,
      oTree.root,
      onItemCompleted,
    );
  }
  /** 递归比较树 */
  async recursion(
    excel: IExcel,
    parent: XDirectory,
    target: Node<DirData>,
    source: Node<DirData>,
    onItemCompleted: (count?: number) => void,
  ) {
    const parentId = parent.id.replace('_', '');
    for (const first of target.children) {
      first.data.meta.typeName = '目录';
      first.data.meta.directoryId = parentId;
      let find = (item: Node<DirData>) => item.data.meta.code == first.data.meta.code;
      let second = source.children.find(find);
      if (second) {
        Object.assign(second.data.meta, first.data.meta);
        first.data.species = second.data.species;
        first.data.forms = second.data.forms;
        first.data.props = second.data.props;
        Object.assign(first.data.meta, await this.sheet.coll.replace(second.data.meta));
      } else {
        first.data.meta.directoryId = parentId;
        Object.assign(first.data.meta, await this.sheet.coll.insert(first.data.meta));
        source.children.push(first);
      }
      excel.context[first.data.meta.code] = first.data;
      onItemCompleted();
    }
    for (const t of target.children) {
      for (const s of source.children) {
        if (t.data.meta.code == s.data.meta.code) {
          await this.recursion(excel, t.data.meta, t, s, onItemCompleted);
        }
      }
    }
  }
  /**
   * 组装原先存在的树
   */
  async dirTree(
    parent: IDirectory,
    onItemCompleted: (count?: number) => void,
    isRoot = false,
  ): Promise<DirData[]> {
    const children: DirData[] = [];
    for (const dir of parent.children) {
      const dirData: DirData = {
        meta: { ...dir.metadata, directoryCode: isRoot ? undefined : parent.code },
        species: {},
        props: {},
        forms: {},
      };
      for (const species of dir.standard.specieses) {
        const speciesData: SpeciesData = {
          meta: { ...species.metadata, directoryCode: dir.code },
          items: {},
        };
        for (const item of await species.loadItems()) {
          if (item.info) {
            speciesData.items[item.info] = {
              ...item,
              speciesCode: species.code,
              parentInfo: item.parent?.info,
            };
          }
        }
        dirData.species[species.code] = speciesData;
        onItemCompleted(50);
      }
      for (const property of dir.standard.propertys) {
        if (property.metadata.code) {
          dirData.props[property.metadata.code] = {
            ...property.metadata,
            directoryCode: dir.code,
          };
        }
      }
      for (const form of dir.standard.forms) {
        const formData: FormData = {
          meta: { ...form.metadata, directoryCode: dir.code },
          attrs: {},
        };
        await form.loadContent();
        for (const attr of form.attributes) {
          formData.attrs[attr.code] = {
            ...attr,
            propCode: attr.property!.info,
            formCode: form.code,
          };
        }
        dirData.forms[form.code] = formData;
        onItemCompleted(50);
      }
      children.push(dirData);
      children.push(...(await this.dirTree(dir, onItemCompleted)));
    }
    return children;
  }
}
