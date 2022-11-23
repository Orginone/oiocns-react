import { deptTree } from './isetting';
/**
 * 设置的基类
 * */ 

class baseSetting implements deptTree { 

}
/**
 * 部门设置的setting
 * */ 
class deptStting extends baseSetting { 
  
}

export const loadDifSetting = () => { 
  return new deptStting();
}


