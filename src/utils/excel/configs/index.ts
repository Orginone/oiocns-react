import { IDirectory } from '@/ts/core';
import { AttrHandler, AttrSheet } from './base/attribute';
import { DirectoryHandler, DirectorySheet } from './base/directory';
import { FormHandler, FormSheet } from './base/form';
import {
  ClassifyHandler,
  ClassifySheet,
  DictHandler,
  DictSheet,
} from './species/species';
import {
  ClassifyItemHandler,
  ClassifyItemSheet,
  DictItemHandler,
  DictItemSheet,
} from './species/speciesitem';
import { PropHandler, PropSheet } from './store/property';

export const getSheets = (directory: IDirectory) => {
  return [
    new DirectorySheet(directory),
    new DictSheet(directory),
    new DictItemSheet(directory),
    new ClassifySheet(directory),
    new ClassifyItemSheet(directory),
    new PropSheet(directory),
    new FormSheet(directory),
    new AttrSheet(directory),
  ];
};

export const getSheetsHandler = (directory: IDirectory) => {
  return [
    new DirectoryHandler(new DirectorySheet(directory)),
    new DictHandler(new DictSheet(directory)),
    new DictItemHandler(new DictItemSheet(directory)),
    new ClassifyHandler(new ClassifySheet(directory)),
    new ClassifyItemHandler(new ClassifyItemSheet(directory)),
    new PropHandler(new PropSheet(directory)),
    new FormHandler(new FormSheet(directory)),
    new AttrHandler(new AttrSheet(directory)),
  ];
};
