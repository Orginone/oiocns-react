import React, { useState } from 'react';
import { TargetType } from '@/ts/core';
import * as im from 'react-icons/im';
import { TargetShare } from '@/ts/base/model';
import { Avatar, Image } from 'antd';
import { Menulist } from '../../ts/core';

const MenuIcon=(info:any)=>{
  console.log(info);
  const size = info.menuinfo.size ?? 22;
  const fontSize = info.menuinfo.fontSize ?? 18;
  let icon;
  console.log(info.menuinfo.type);
  switch(info.menuinfo.type){
    case  "loginout":
      icon=<im.ImEnter  fontSize={fontSize}/>
      break
    default:

     break
  }
  return (
    <Avatar
      size={size}
      icon={icon}
      style={{ background: 'transparent', color: '#606060' }}
    />
  );

}
export default MenuIcon
