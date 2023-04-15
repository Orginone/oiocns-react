import { Card, Typography,Modal, Form,Input,Button,message  } from 'antd';
import React, { useMemo, useState,useRef,useEffect } from 'react';
import cls from './index.module.less';
import CardOrTable from '@/components/CardOrTableComp';
import { Route, useHistory } from 'react-router-dom';
import { GroupBtn } from '@/components/GroupBtn';
import { login,create_repo,repo_list } from "@/services/MyRequest/index";
import userCtrl from '@/ts/controller/setting';
import { kernel } from '@/ts/base';
import { timestampToDate } from './hook/index';


const Software: React.FC = () => {
  const history = useHistory();
  const [tabKey, setTabKey] = useState<string>('key1');
  const parentRef = useRef<any>(null); //父级容器Dom
  const [isCo, setIsCo] = useState(false); //新建仓库按钮
  const [isssh, setIsssh] = useState(false); //新建仓库按钮
  const [iswebsite, setiswebsite] = useState(false); //新建仓库按钮
  
  const [form] = Form.useForm()
  const uname=userCtrl.user.target.id
  const data:Object={token:"7c49b153d4b59f8c0cf8c3e18dc80cb7",uname:uname} //input的data
  const [Datas, setDatas] = useState({
    formdata:[], //input的data
    websitedata:{}            //仓库地址的信息
  });

  useEffect(()=>{
    login(data)
    repo_list(data).then(res=>{
      setDatas({...Datas,...{formdata:res.data.data}})
    })
    console.log(userCtrl.space.id,uname);
    
    // const res=kernel.queryNodes({id:"427850480614510592",spaceId:userCtrl.space.id})
    // const res=kernel.queryInstance({id:"427850480614510592",spaceId:userCtrl.space.id,page:{
    //   limit: 1,
    //   offset: 99,
    //   filter: '',
    // }})
    // console.log(res.then(resq=>{
    //   console.log(resq);
      
    // }));
    // debugger
    
  },[])

const Table= ()=>{
  return (
    <>
    {/* <button onClick={async ()=>{
      const res = await kernel.queryInstance({
        id: "427850480614510592",
        page: { offset: 0, limit: 100000, filter: '' },
      });
      console.log(res);
      
    }}>123</button> */}
  <CardOrTable
    dataSource={Datas.formdata}
    stripe
    parentRef={parentRef}
    style={{margin:15}}
    operation={(e)=>{
      return ([
        {
          key: 'open',
          label: '打开',
          onClick: () => {
          },
        },
        {
          key: 'detail',
          label: '仓库地址详情',
          onClick: () => {
            console.log(e);
            setDatas({...Datas,websitedata:e.RepoUrl})
            setiswebsite(true)
          },
        }])
      }}
    columns={[
      {
        title: '序号',
        valueType: 'index',
        width: 50,
      },
      {
        title: '仓库名称',
        dataIndex: 'Name',
      },
      {
        title: '代码处理人',
        dataIndex:'OwnerName',
      },
      {
        title: '默认分支',
        dataIndex: 'DefaultBranch',
      },
      {
        title: '创建时间',
        dataIndex: 'CreatedUnix',
        render:(text)=>{
          return timestampToDate(text)
        }
      },
    ]}
    rowKey={(record: any) => {return record?.prod?.id}}
  />
  </>)
}
  // 应用首页dom
  const AppIndex = useMemo(() => {
    console.log(Datas,tabKey);
    return (
      <div
        className={`pages-wrap flex flex-direction-col ${cls['pages-wrap']}`}>
        <Card
          title={<Typography.Title level={5}> 软件资产</Typography.Title>}
          className={cls['app-tabs']}
          tabList={[
            { tab: '我的仓库', key: 'key1' },
            { tab: '集群列表', key: 'key2' },
            { tab: '交付目标', key: 'key3' },
          ]}
          // extra={
          //   <GroupBtn
          //     list={[
          //       {
          //         text: '新建仓库',
          //         onClick: () => {
          //           setIsCo(true)
          //         },
          //       },
          //       {
          //         text: '添加ssh',
          //         onClick: () => {
          //           setIsssh(true)
          //         },
          //       }
          //     ]}
          //   />
          // }
          activeTabKey={tabKey}
          onTabChange={(k) => {
            setTabKey(k);
            
          }}>

          <div className={cls['page-content-table']} ref={parentRef}>
            <Table />
      </div>

        </Card>
      </div>
    );
  }, [tabKey,Datas]);

  return (
    <>
      {AppIndex}
      <Modal title="新建仓库" open={isCo} onOk={()=>{ //新建仓库
        form.validateFields().then(values => {
          form.resetFields();
          console.log(values);
          create_repo(data).then(res=>{
            message.success(res.data.msg)
            
          })
          setIsCo(false)
        })
        .catch(info => {
          console.log('Validate Failed:', info);
          setIsCo(true)
        });
        
        }} onCancel={()=>{setIsCo(false)}}>
      <Form
      name="basic"
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      initialValues={{ remember: true }}

      onValuesChange={(_, allValues)=>{
        Object.assign(data,allValues)
      }}
      autoComplete="off"
    >
      <Form.Item
        label="仓库名称"
        name="repo_name"
        rules={[{ required: true, message: '必填项' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="代码处理事件"
        name="remark"
        rules={[{ required: false, message: '必填项!' }]}
      >
       <Input.TextArea rows={4} />
      </Form.Item>

    </Form>
      </Modal>
      
      <Modal title="ssh" open={isssh} onOk={()=>{
        form.validateFields().then(values => {
          form.resetFields();
          console.log(values);
          setIsssh(false)
        })
        .catch(info => {
          console.log('Validate Failed:', info);
          setIsssh(true)
        });
        
        }} onCancel={()=>{setIsssh(false)}}>
                <Form.Item
        label="内容"
        name="repo_name"
        rules={[{ required: true, message: '必填项' }]}
      >
        <Input />
      </Form.Item>
      </Modal>

      <Modal title="仓库地址详情" width={"50%"} open={iswebsite} onOk={()=>{
        
        }} onCancel={()=>{setiswebsite(false)}}>
          <>
          <div>SSH地址：{Datas.websitedata.SSH}</div>
          <div>HTTP地址：{Datas.websitedata.HTTPS}</div>
          </>
      </Modal>
    </>
  );
};

export default React.memo(Software);
