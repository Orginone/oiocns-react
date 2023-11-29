import * as i from '../impl';
import * as t from '../type';

export class DirectorySheet extends i.Sheet<t.Directory> {
  constructor(dir: t.IDirectory) {
    super(
      t.generateUuid(),
      '目录',
      [
        { title: '上级目录代码', dataIndex: 'directoryCode', valueType: '描述型' },
        { title: '目录名称', dataIndex: 'name', valueType: '描述型' },
        { title: '目录代码', dataIndex: 'code', valueType: '描述型' },
        { title: '备注信息', dataIndex: 'remark', valueType: '描述型' },
        { title: '主键', dataIndex: 'id', valueType: '描述型' },
        { title: '上级目录主键', dataIndex: 'directoryId', valueType: '描述型' },
      ],
      dir,
    );
  }

  get coll(): t.XCollection<t.schema.XDirectory> {
    return this.dir.resource.directoryColl;
  }
}

export class DirectoryHandler extends i.SheetHandler<DirectorySheet> {
  /**
   * 数据校验
   * @param data 数据
   */
  checkData() {
    const allErrors: t.Error[] = [];
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
      const tree = new i.Tree(
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
    excel: t.IExcel,
    onItemCompleted: (count?: number) => void,
  ): Promise<void> {
    const nTree = new i.Tree<t.DirData>(
      this.sheet.data.map((item) => {
        return { meta: item, forms: {} };
      }),
      (n) => n.meta.code,
      (n) => n.meta.directoryCode,
    );
    const oTree = new i.Tree(
      Object.entries(excel.context.directories).map((item) => item[1]),
      (n) => n.meta.id.replace('_', ''),
      (n) => n.meta.directoryId,
      { meta: this.sheet.dir.metadata, forms: {} },
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
    excel: t.IExcel,
    parent: t.schema.XDirectory,
    target: i.Node<t.DirData>,
    source: i.Node<t.DirData>,
    onItemCompleted: (count?: number) => void,
  ) {
    const parentId = parent.id.replace('_', '');
    for (const first of target.children) {
      first.data.meta.typeName = '目录';
      first.data.meta.directoryId = parentId;
      let find = (item: i.Node<t.DirData>) => item.data.meta.code == first.data.meta.code;
      let second = source.children.find(find);
      if (second) {
        Object.assign(second.data.meta, first.data.meta);
        first.data.forms = second.data.forms;
        Object.assign(first.data.meta, await this.sheet.coll.replace(second.data.meta));
      } else {
        first.data.meta.directoryId = parentId;
        Object.assign(first.data.meta, await this.sheet.coll.insert(first.data.meta));
        source.children.push(first);
      }
      excel.context.directories[first.data.meta.code] = first.data;
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
}
