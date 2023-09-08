import React from "react";
import './index.less';
import { Button } from "antd";

function VersionPage(){
    return (
        <>
            <div className="version_page">
                <h2>版本发布</h2>
                <Button type="default" style={{background: '#21ba45',color: '#fff',border: '#21ba45'}}>发布新版</Button>
            </div>
            <div className="gap"></div>
            <div className="bottom_btn">
            <Button type="default"  style={{marginRight: '1rem'}}>上一页</Button><Button type="default" >下一页</Button>
            </div>
        </>
    )
}

export default VersionPage;