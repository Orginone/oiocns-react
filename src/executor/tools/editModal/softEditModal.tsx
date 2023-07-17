import { Modal,message } from 'antd';
import { formatDate } from '@/utils';
import orgCtrl from '@/ts/controller';
import React from 'react';
import { kernel, model, schema } from '@/ts/base';
import { IBelong } from '@/ts/core';
import {
  login,
  create_repo,
  // addssh,
  repo_list,
  // webhooks,
  // kubevelaLogin,
  // kubeveUser_info,
  // kubeveDefinitions,
  // kubeveEnvs,kubeveDefin,
  // kubeveList,
  // kubeveIssue,
  } from "../workForm/MyRequest";

interface IFormEditProps {
  form: schema.XForm;
  fields: model.FieldModel[];
  belong: IBelong;
  create: boolean;
  initialValues?: any;
  onSave: (values: any) => void;
  formData:any;
  selectKeys:any;
}

const SoftEditModal = ({
  form,
  fields,
  belong,
  create,
  initialValues,
  onSave,
  formData,
  selectKeys
}: IFormEditProps) => {

  const select=formData.after?.filter(
    (i:any) => selectKeys.includes(i.Id),
  )
  const repname=select.map((val:any)=> val["465126561327222784"]).join(` 和 `)
  const modal = Modal.confirm({
    icon: <></>,
    width: '80vw',
    okText: `确认创建`,
    cancelText: '关闭',
    onCancel: () => modal.destroy(),
    content: (
    <>
<div>{form.id === "465120285687943168"&&<p>确定创建{`${select.length}`}个仓库么？仓库名称分别为:{repname}</p>}</div>
    </>

    ),
    onOk:  () => {
      select?.forEach( async(val:any) => {
        if(!val["465126561327222784"]){  message.error(`请确认选择的数据都有仓库名称`); return;}

        const loginArguments={token:"7c49b153d4b59f8c0cf8c3e18dc80cb7",uname:val.Creater}
        await login(loginArguments)
        try {
          const create= await create_repo({...loginArguments,repo_name:val["465126561327222784"]}) //创建仓库
          // const po=await webhooks({username:val.Creater,reponame:val["465126561327222784"]})
          // console.log("webhooks",po);

          if(create.data.msg=='ok'){
            message.success(`仓库已经存在`)
            
          }else{ //创建仓库时
            const mystort=await repo_list(loginArguments)
            let bs=mystort?.data?.data
            var as = bs.reduce((prevItem:any, currentItem:any)=> {
              return (currentItem.ID > prevItem.ID) ? currentItem : prevItem;
          });
            
            await kernel.anystore.createThing(orgCtrl.user.id, '').then(async (res) => {
              if (res.success && res.data) {
            const gogsData={
                    "hook": "",
                    "taskId": "0",
                    "title": "新建代码仓",
                    "defineId": "467316993276645376",
                    "applyId": "445723536485650432",
                    "content": "备注信息自动生成的",
                    "contentType": "Text",
                    "data": JSON.stringify({
                      "data": {
                          "467322086176722944": [
                              {
                                  "before": [],
                                  "after": [
                                      {
                                        ...res.data,
                                          "467322153314947072": `${as.ID}`,
                                          "467322157345673216": as.Name,
                                          "467322158721404928": as.OwnerName,
                                          "467322162647273472": as.DefaultBranch,
                                          "467322164207554560": formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                                          "467322165541343232": as.RepoUrl.SSH,
                                          "467322166917074944": as.RepoUrl.HTTPS
                                      }
                                  ],
                                  "nodeId": "467322292913967104",
                                  "creator": orgCtrl.user.id,
                                  "createTime":formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                              }
                          ]
                      },
                      "fields": {
                          "467322086176722944": [
                              {
                                  "id": "467322153314947072",
                                  "rule": "{}",
                                  "name": "仓库id",
                                  "code": "T467319799488319488",
                                  "remark": "仓库id",
                                  "lookups": [],
                                  "valueType": "描述型"
                              },
                              {
                                  "id": "467322157345673216",
                                  "rule": "{}",
                                  "name": "仓库名称",
                                  "code": "T467319900113866752",
                                  "remark": "仓库名称",
                                  "lookups": [],
                                  "valueType": "描述型"
                              },
                              {
                                  "id": "467322158721404928",
                                  "rule": "{}",
                                  "name": "创建人",
                                  "code": "T467320023803891712",
                                  "remark": "创建人",
                                  "lookups": [],
                                  "valueType": "描述型"
                              },
                              {
                                  "id": "467322162647273472",
                                  "rule": "{}",
                                  "name": "默认分支",
                                  "code": "T467320124978892800",
                                  "remark": "默认分支",
                                  "lookups": [],
                                  "valueType": "描述型"
                              },
                              {
                                  "id": "467322164207554560",
                                  "rule": "{}",
                                  "name": "创建时间",
                                  "code": "T467320201722073088",
                                  "remark": "创建时间",
                                  "lookups": [],
                                  "valueType": "描述型"
                              },
                              {
                                  "id": "467322165541343232",
                                  "rule": "{}",
                                  "name": "SSH地址",
                                  "code": "T467320352431804416",
                                  "remark": "SSH地址",
                                  "lookups": [],
                                  "valueType": "描述型"
                              },
                              {
                                  "id": "467322166917074944",
                                  "rule": "{}",
                                  "name": "HTTP地址",
                                  "code": "T467320445184643072",
                                  "remark": "HTTP地址",
                                  "lookups": [],
                                  "valueType": "描述型"
                              }
                          ]
                      },
                      "primary": {
                          "467322153314947072": `${as.ID}`,
                          "467322157345673216": as.Name,
                          "467322158721404928": as.OwnerName,
                          "467322162647273472": as.DefaultBranch,
                          "467322164207554560": formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                          "467322165541343232": as.RepoUrl.SSH,
                          "467322166917074944": as.RepoUrl.HTTPS
                      },
                      "node": {
                          "id": "467322292913967104",
                          "code": "node_cb4b9cd0-e4c8-4ac1-bd3d-9b0f63a19e6a",
                          "type": "起始",
                          "name": "发起角色",
                          "num": 1,
                          "destType": "角色",
                          "destName": "全员",
                          "forms": [
                              {
                                  "id": "467322086176722944",
                                  "typeName": "主表",
                                  "directoryId": "464836701316059136",
                                  "belongId": "445723536485650432",
                                  "name": "代码仓库信息卡查看",
                                  "code": "lookgogs",
                                  "remark": "代码仓库信息卡查看",
                                  "status": 1,
                                  "createUser": "445654954863104000",
                                  "updateUser": "445654954863104000",
                                  "version": "1",
                                  "createTime": "2023-07-13 13:31:07.770",
                                  "updateTime": "2023-07-13 13:31:07.770"
                              }
                          ]
                      },
                      "allowAdd": true,
                      "allowEdit": true,
                      "allowSelect": true
                  }),
                    "childrenData": ""
                  }
            await kernel.createWorkInstance(gogsData);
              }
            });
            message.success(`${create.data.msg} `)
          }


        } catch (error:any) {
          // 执行失败时的逻辑
          console.log(error);
          message.error(`创建失败，错误原因：${error?.response.data}`)
        }
        
      });
        modal.destroy();
    },
  });
};

export default SoftEditModal;
