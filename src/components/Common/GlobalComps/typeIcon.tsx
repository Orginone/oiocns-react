import { TargetType } from '@/ts/core';
import React from 'react';
import * as im from '@/icons/im';
import * as fa from '@/icons/fa';
import { IconBaseProps } from '@react-icons/all-files/lib';

interface TypeIconInfo {
  avatar?: boolean;
  size?: number;
  iconType: string;
}

/** 类型图标 */
const TypeIcon = ({ avatar, iconType, size }: TypeIconInfo) => {
  const iconSize = size || 12;
  const config: IconBaseProps = { size: iconSize, color: '#9498df' };
  const loadFileIcon = () => {
    switch (iconType) {
      case 'application/pdf':
        return <fa.FaFilePdf {...config} />;
      case 'application/x-zip-compressed':
        return <fa.FaFileArchive {...config} />;
    }
    if (iconType?.startsWith('application')) {
      return <fa.FaAppStoreIos {...config} />;
    } else if (iconType?.startsWith('video')) {
      return <fa.FaFileVideo {...config} />;
    } else if (iconType?.startsWith('image')) {
      return <fa.FaFileImage {...config} />;
    } else if (iconType?.startsWith('text')) {
      return <fa.FaFileCode {...config} />;
    } else if (iconType?.startsWith('audio')) {
      return <fa.FaFileAudio {...config} />;
    }
    return <im.ImFilesEmpty {...config} />;
  };
  const loadIcon = () => {
    switch (iconType) {
      case '动态':
        return <im.ImSafari {...config} />;
      case '目录':
        return <im.ImFolder {...config} />;
      case '成员目录':
        return <im.ImBooks {...config} />;
      case '标准':
        return <im.ImFileExcel {...config} />;
      case '字典':
        return <im.ImBook {...config} />;
      case '分类':
        return <im.ImTree {...config} />;
      case '分类项':
        return <im.ImPriceTags {...config} />;
      case '属性':
        return <im.ImJoomla {...config} />;
      case '应用':
        return <im.ImDropbox {...config} />;
      case '模块':
        return <im.ImDelicious {...config} />;
      case '办事':
        return <im.ImShuffle {...config} />;
      case '表单':
      case '报表':
      case '事项配置':
      case '实体配置':
        return <im.ImPaste {...config} />;
      case '角色':
        return <im.ImKey {...config} />;
      case '权限':
        return <im.ImShield {...config} />;
      case '激活':
        return <im.ImPowerCord {...config} />;
      case '事项':
        return <im.ImClipboard {...config} />;
      case '加用户':
        return <im.ImUserPlus {...config} />;
      case TargetType.Company:
      case TargetType.University:
      case TargetType.Hospital:
        return <im.ImOffice {...config} />;
      case TargetType.Storage:
        return <im.ImDrive {...config} />;
      case TargetType.Station:
        return <im.ImAddressBook {...config} />;
      case '子流程':
      case TargetType.Group:
        return <im.ImTree {...config} />;
      case TargetType.Cohort:
        return <im.ImBubbles2 {...config} />;
      case TargetType.Section:
      case TargetType.Department:
        return <im.ImLibrary {...config} />;
      case TargetType.Person:
        return <im.ImUserTie {...config} />;
      case TargetType.College:
        return <im.ImTrophy {...config} />;
      case TargetType.Laboratory:
        return <im.ImJoomla {...config} />;
      case TargetType.Office:
        return <im.ImBriefcase {...config} />;
      case TargetType.Research:
        return <im.ImFlickr4 {...config} />;
      case TargetType.Working:
        return <im.ImUsers {...config} />;
      case 'newDir':
        return <im.ImFolderPlus {...config} />;
      case 'refresh':
        return <im.ImSpinner9 {...config} />;
      case 'remark':
        return <im.ImWrench {...config} />;
      case 'open':
        return <im.ImDelicious {...config} />;
      case 'design':
        return <im.ImEqualizer {...config} />;
      case 'copy':
        return <im.ImCopy {...config} />;
      case 'move':
        return <im.ImShuffle {...config} />;
      case 'parse':
        return <im.ImCoinPound {...config} />;
      case 'rename':
        return <im.ImPencil {...config} />;
      case 'delete':
        return <im.ImBin {...config} />;
      case 'restore':
        return <im.ImUndo2 {...config} />;
      case 'remove':
        return <im.ImUserMinus {...config} />;
      case 'update':
        return <im.ImPriceTags {...config} />;
      case 'pull':
        return <im.ImUserPlus {...config} />;
      case 'qrcode':
        return <im.ImQrcode {...config} />;
      case 'joinFriend':
        return <im.ImUserPlus {...config} />;
      case 'joinCohort':
        return <im.ImUsers {...config} />;
      case 'joinCompany':
        return <im.ImPlus {...config} />;
      case 'joinGroup':
        return <im.ImEnter {...config} />;
      case 'newFile':
        return <im.ImUpload {...config} />;
      case 'taskList':
        return <im.ImList {...config} />;
      default:
        return loadFileIcon();
    }
  };
  if (avatar) {
    return loadIcon();
  }
  return <div style={{ paddingRight: 10 }}>{loadIcon()}</div>;
};

export default TypeIcon;
