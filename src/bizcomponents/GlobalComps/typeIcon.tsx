import React from 'react';
import * as im from 'react-icons/im';

interface TypeIconInfo {
  size?: number;
  iconType: string;
}

/** 类型图标 */
const TypeIcon = ({ iconType, size }: TypeIconInfo) => {
  const loadIcon = () => {
    switch (iconType) {
      case 'new':
        return <im.ImFilesEmpty size={size ?? 12} />;
      case 'newDir':
        return <im.ImFolderPlus size={size ?? 12} />;
      case 'newDict':
        return <im.ImBook size={size ?? 12} />;
      case 'newSpecies':
        return <im.ImTree size={size ?? 12} />;
      case 'newProperty':
        return <im.ImJoomla size={size ?? 12} />;
      case 'newApp':
        return <im.ImDropbox size={size ?? 12} />;
      case 'newWorkConfig':
        return <im.ImInsertTemplate size={size ?? 12} />;
      case 'newThingConfig':
        return <im.ImPaste size={size ?? 12} />;
      case 'newCohort':
        return <im.ImBubbles2 size={size ?? 12} />;
      case 'newIdentity':
        return <im.ImKey size={size ?? 12} />;
      case 'newCompany':
        return <im.ImOffice size={size ?? 12} />;
      case 'newStation':
        return <im.ImAddressBook size={size ?? 12} />;
      case 'newGroup':
        return <im.ImTree size={size ?? 12} />;
      case 'newDepartment':
        return <im.ImLibrary size={size ?? 12} />;
      case 'settingAuth':
        return <im.ImShield size={size ?? 12} />;
      case 'refresh':
        return <im.ImSpinner9 size={size ?? 12} />;
      case 'remark':
        return <im.ImWrench size={size ?? 12} />;
      case 'open':
        return <im.ImDelicious size={size ?? 12} />;
      case 'copy':
        return <im.ImCopy size={size ?? 12} />;
      case 'move':
        return <im.ImShuffle size={size ?? 12} />;
      case 'rename':
        return <im.ImPencil size={size ?? 12} />;
      case 'delete':
        return <im.ImBin size={size ?? 12} />;
      case 'remove':
        return <im.ImUserMinus size={size ?? 12} />;
      case 'update':
        return <im.ImPriceTags size={size ?? 12} />;
      case 'pull':
        return <im.ImUserPlus size={size ?? 12} />;
      case 'directory':
        return <im.ImFolder size={size ?? 12} />;
    }
    return <></>;
  };
  return <div style={{ paddingRight: 10 }}>{loadIcon()}</div>;
};

export default TypeIcon;
