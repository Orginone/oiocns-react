import { DictItemModel, DictModel, PropertyModel, SpeciesModel } from '@/ts/base/model';
import { ISpeciesItem, SpeciesType, IPropClass, IDictClass, IDict } from '@/ts/core';
import { SheetConfig, SheetReadConfig } from "./index";

interface Context {
    speciesIndex: { [key: string]: ISpeciesItem };
    dictIndex: { [key: string]: IDict };
}

export class ReadError extends Error {
    message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }
}

export const getConfigs = (species: ISpeciesItem) => {
    let configs: SheetConfig[] = [{
        sheetName: species.metadata.typeName,
        metaColumns: [
            { name: "名称", type: "描述型" },
            { name: "代码", type: "描述型" },
            { name: "类型", type: "选择型", options: species.speciesTypes },
            { name: "定义", type: "描述型" },
        ]
    }];
    switch (species.metadata.typeName) {
        case SpeciesType.Store:
            configs.push(
                {
                    sheetName: "属性定义",
                    metaColumns: [
                        { name: "类型", type: "描述型" },
                        { name: "属性名称", type: "描述型" },
                        { name: "属性类型", type: "选择型", options: ["数值型", "描述型", "选择型", "分类型", "附件型", "日期型", "时间型", "用户型"] },
                        { name: "单位", type: "描述型" },
                        { name: "枚举字典", type: "选择型" },
                        { name: "属性定义", type: "描述型" }
                    ]
                }
            );
            break;
        case SpeciesType.Dict:
            configs.push(
                {
                    sheetName: "字典定义",
                    metaColumns: [
                        { name: "类型", type: "描述型" },
                        { name: "字典名称", type: "描述型" },
                        { name: "字典代码", type: "描述型" },
                        { name: "备注", type: "描述型" },
                    ]
                },
                {
                    sheetName: "字典项定义",
                    metaColumns: [
                        { name: "字典名称", type: "描述型" },
                        { name: "名称", type: "描述型" },
                        { name: "值", type: "描述型" },
                        { name: "备注", type: "描述型" },
                    ]
                }
            );
            break;
    }
    return configs;
}

export const getReadConfigs = (species: ISpeciesItem) => {
    let readConfigs: SheetReadConfig[] = [];
    for (let config of getConfigs(species)) {
        switch (config.sheetName) {
            case SpeciesType.Store:
            case SpeciesType.Dict:
                readConfigs.push({
                    ...config,
                    initContext: (context: Context) => {
                        context.speciesIndex = {};
                    },
                    checkData: async (data: any[]) => {
                        for (let item of data) {
                            if (!item["名称"] || !item["代码"] || !item["类型"] || !item["定义"]) {
                                throw new ReadError("表[" + config.sheetName + "]存在未填写的名称、代码、类型以及定义！");
                            }
                            let index = species.speciesTypes.indexOf(item["类型"])
                            if (index == -1) {
                                throw new ReadError("表[" + config.sheetName + "]子类型不存在[" + item["类型"] + "]类型，请在[" + species.speciesTypes.join("，") + "]几个选项中选择！")
                            }
                        }
                    },
                    operatingItem: async (item: { [key: string]: string }, context: Context) => {
                        let child = species.children.find(child => child.metadata.code == item["代码"]);
                        if (child) {
                            item["类型 ID"] = child.id;
                            context.speciesIndex[child.id] = child;
                        } else {
                            let created = await species.create({
                                name: item["名称"],
                                code: item["代码"],
                                typeName: config.sheetName,
                                parentId: species.metadata.id,
                                shareId: species.metadata.shareId,
                                authId: species.metadata.authId,
                                remark: item["定义"]
                            } as SpeciesModel);
                            item["类型 ID"] = created?.metadata.id ?? "";
                            if (created) {
                                context.speciesIndex[created.metadata.id] = created;
                            }
                        }
                    },
                    completed: (current: SheetReadConfig, sheets: SheetReadConfig[]) => {
                        let typeMap: { [key: string]: string } = {};
                        species.children.forEach(item => typeMap[item.metadata.name] = item.metadata.id);
                        for (let sheet of sheets) {
                            if (sheet.sheetName != current.sheetName) {
                                let index = sheet.metaColumns.findIndex(item => item.name == "类型");
                                if (index != -1) {
                                    sheet.data?.forEach(item => item["类型 ID"] = typeMap[item["类型"]]);
                                }
                            }
                        }
                    }
                });
                break;
            case "属性定义":
                readConfigs.push({
                    ...config,
                    checkData: async (data: any[]) => {
                        let dicts = await species.current.space.loadDicts();
                        let dictMap: { [key: string]: string } = {};
                        dicts.forEach(item => dictMap[item.metadata.name] = item.metadata.id);
                        for (let item of data) {
                            if (!item["类型"] || !item["属性名称"] || !item["属性类型"] || !item["属性定义"]) {
                                throw new ReadError("表[属性定义]存在未填写的类型、属性名称、属性类型以及属性定义！");
                            }
                            if (!item["类型 ID"]) {
                                throw new ReadError("表[属性定义]未匹配到名称为" + item["类型"] + "的类型！");
                            }
                            if (item["属性类型"] == "选择型") {
                                if (item["枚举字典"]) {
                                    if (!dictMap[item["枚举字典"]]) {
                                        throw new ReadError("表[属性定义]未获取到名称为" + item["枚举字典"] + "的字典！");
                                    }
                                    item["字典 ID"] = dictMap[item["枚举字典"]];
                                } else {
                                    throw new ReadError("表[属性定义]当属性类型为选择型时，必须填写枚举字典！");
                                }
                            }
                        }
                    },
                    operatingItem: async (item: { [key: string]: string }, context: Context) => {
                        let child = context.speciesIndex[item["类型 ID"]];
                        let properties = await (child as IPropClass).loadAllProperty();
                        let property = properties.find(property => property.name == item["属性名称"]);
                        if (property) {
                            await (child as IPropClass).updateProperty({
                                ...property,
                                valueType: item["属性类型"],
                                unit: item["单位"],
                                dictId: item["字典 ID"],
                                remark: item["属性定义"]
                            });
                            item["属性 ID"] = property.id;
                        } else {
                            let created = await (child as IPropClass).createProperty({
                                name: item["属性名称"],
                                valueType: item["属性类型"],
                                unit: item["单位"],
                                speciesId: item["类型 ID"],
                                dictId: item["字典 ID"],
                                remark: item["属性定义"]
                            } as PropertyModel);
                            item["属性 ID"] = created?.id ?? "";
                        }
                    },
                });
                break;
            case "字典定义":
                readConfigs.push({
                    ...config,
                    initContext: (context: Context) => {
                        context.dictIndex = {};
                    },
                    checkData: async (data: any[]) => {
                        for (let item of data) {
                            if (!item["类型"] || !item["字典名称"] || !item["字典代码"] || !item["备注"]) {
                                throw new ReadError("表[字典定义]存在未填写的类型、字典名称、字典代码以及备注！");
                            }
                            if (!item["类型 ID"]) {
                                throw new ReadError("表[字典定义]未匹配到名称为" + item["类型"] + "的类型！");
                            }
                        }
                    },
                    operatingItem: async (item: { [key: string]: string }, context: Context) => {
                        let child = context.speciesIndex[item["类型 ID"]];
                        let dicts = await (child as IDictClass).loadDicts();
                        let dict = dicts.find(dict => dict.metadata.code == item["字典代码"]);
                        if (dict) {
                            await dict.update({
                                ...dict.metadata,
                                name: item["字典名称"],
                                remark: item["备注"]
                            })
                            item["字典 ID"] = dict.id;
                            context.dictIndex[dict.id] = dict;
                        } else {
                            let created = await (child as IDictClass).createDict({
                                name: item["字典名称"],
                                code: item["字典代码"],
                                remark: item["备注"],
                                speciesId: child.id
                            } as DictModel);
                            item["字典 ID"] = created?.id ?? "";
                            if (created) {
                                context.dictIndex[created.id] = created;
                            }
                        }
                    },
                    completed: async (current: SheetReadConfig, sheets: SheetReadConfig[]) => {
                        let dictMap: { [key: string]: string } = {};
                        await (await species.current.space.loadDicts()).forEach(item => dictMap[item.metadata.name] = item.id);
                        for (let sheet of sheets) {
                            if (sheet.sheetName != current.sheetName) {
                                let index = sheet.metaColumns.findIndex(item => item.name == "字典名称");
                                if (index != -1) {
                                    sheet.data?.forEach(item => item["字典 ID"] = dictMap[item["字典名称"]]);
                                }
                            }
                        }
                    }
                });
                break;
            case "字典项定义":
                readConfigs.push({
                    ...config,
                    checkData: async (data: any[]) => {
                        for (let item of data) {
                            if (!item["字典名称"] || !item["名称"] || !item["值"] || !item["备注"]) {
                                throw new ReadError("表[字典项定义]存在未填写的字典名称、名称、值以及备注！");
                            }
                            if (!item["字典 ID"]) {
                                throw new ReadError("表[字典项定义]未匹配到名称为" + item["字典名称"] + "的字典！");
                            }
                        }
                    },
                    operatingItem: async (item: { [key: string]: string }, context: Context) => {
                        let dict = context.dictIndex[item["字典 ID"]];
                        let dictItems = await dict.loadItems();
                        let dictItem = dictItems.find(dictItem => dictItem.name == item["名称"]);
                        if (dictItem) {
                            await dict.updateItem({
                                ...dictItem,
                                value: item["值"]?.toString(),
                                remark: item["备注"]
                            });
                            item["字典项 ID"] = dictItem.id;
                        } else {
                            let created = await dict.createItem({
                                name: item["名称"],
                                value: item["值"]?.toString(),
                                dictId: dict.id,
                                remark: item["备注"]
                            } as DictItemModel);
                            item["字典项 ID"] = created?.id ?? "";
                        }
                    },
                });
                break;
        }
    }
    return readConfigs;
}