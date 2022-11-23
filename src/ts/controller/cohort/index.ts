
import  Cohort  from '../../core/target/cohort';
import  Person  from '../../core/target/person';


import { TargetType } from '../../core/enum';
import { model } from '../../base';
import provider from '../../core/provider'
/**
 * 群组控制器
 */
 class CohortController {
  private _cohorts: Cohort[];
  public callBack!:Function;
  constructor(cohorts:Cohort[]) {
    this._cohorts = cohorts;
  }
  
  public get getCohorts(): Cohort[] {
    return this._cohorts;

  }
  
  // this._joinedCohorts = this._joinedCohorts.filter((obj) => obj.target.id != id);

  public get getMyCohort():Cohort[]{
    // const id = provider.getWorkSpace().then(workerData=>{
    //   return workerData?.target.id
    // })
    // let data = this._cohorts.filter((obj) => id == obj.target.belongId);
    let data = this._cohorts.filter((obj) => provider.getWorkSpace().then(workerData=>{
       workerData?.target.id == obj.target.belongId
    }));
   const a =  provider.getWorkSpace().then(async workerData=>{
       return await workerData?.getJoinApproval()
   })
    console.log("我的群组",data)
    return data;
  }

  
  public setCallBack(fun:Function){
    this.callBack = fun;
  }


/**
 * 群组变更
 * @param name 名称
 * @param code 编号
 * @param remark 备注
 * @returns 
 */
  public async updateCohort (obj:Cohort,name:string,code:string,remark:string):Promise<any>{
     const res = await obj.updateTargetBase(name,code,TargetType.Cohort,remark)
     this.callBack([... this.getMyCohort])
     console.log("callback",this.getMyCohort)
     return res
  }
  /**
 * 创建群组
 * @param name 名称
 * @param code 编号
 * @param remark 备注
 * @returns 
 */
   public async createCohort (obj:Person,name:string,code:string,remark:string):Promise<any>{
    const res = await obj.createCohort(name,code,remark)
    this._cohorts = provider.getPerson!.ChohortArray;
    this.callBack([... this.getMyCohort])
    return res
 }
 /**
  * 搜索群组
  * @param obj 
  * @param name 
  * @returns 
  */
 public async searchCohort (obj:Person,name:string):Promise<model.ResultType<any>>{
  const res = await obj.searchTargetByName(name,TargetType.Cohort)
  return res
}
/**
  * 搜索人
  * @param obj 
  * @param name 
  * @returns 
  */
 public async searchPerson (obj:Person,name:string):Promise<model.ResultType<any>>{
  const res = await obj.searchTargetByName(name,TargetType.Person)
  return res
}
/**
 * 发起加入群组申请
 * @param obj 
 * @param destId 
 * @returns 
 */
public async joinCohort (obj:Person,destId:string):Promise<model.ResultType<any>>{
  const res = await obj.applyJoin(destId,TargetType.Cohort)
  return res
}
/**
 * 拉人加入群组
 * @param obj 
 * @param destId 
 * @returns 
 */
 public async pullCohort (obj:Cohort,PersonId:[string]):Promise<boolean>{
  const res = await obj.pullPersons(PersonId)
  return res
}
/**
 * 解散群组
 * @param obj 
 * @param id 
 * @param belongId 
 * @returns 
 */
 public async deleteCohort (obj:Person,id:string,belongId:string):Promise<model.ResultType<any>>{
  const res = await obj.deleteCohorts(id,belongId)
  if(res.success){
    let data =  this._cohorts.filter((obj) => id != obj.target.id);
    this._cohorts = data;
    this.callBack([... this.getMyCohort])
  }
  return res
}

}



export default new CohortController(provider.getPerson!.ChohortArray)
