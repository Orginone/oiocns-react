import React, { useState, useEffect } from 'react';
import './index.less';
import { IRepository } from '@/ts/core/thing/standard/repository';
import { getTimeAgo } from '../../../../hook/index';
import { UserOutlined, RetweetOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Button, Avatar } from 'antd';
import DiffViewer, { DiffMethod } from 'react-diff-viewer';
// import diffData from './test';

interface IProps {
  current: IRepository;
  node: any;
}

const CodeComparison: React.FC<IProps> = ({ current, node }) => {
  const [splitView, setSplitView] = useState<boolean>(false);
  const [diffData, setDiffData] = useState<any>(null);
  // console.log(diffData);
  // 从提供的数据中提取左侧和右侧的内容
  // 从提供的数据中提取左侧和右侧的内容，并去除前面的 + 和 -
  //展开项是否展开
  const initiallyExpandedItems = [0, 1, 2, 3, 4, 5, 6]; // 默认展开前四项
  const [expandedItems, setExpandedItems] = useState<Array<any>>(initiallyExpandedItems);
  //展开项展示内容
  // const [expandedcontent, setExpandedcontent] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data: any = await current.Codecomparison(`/${node.ID}`);
      console.log(data);
      setDiffData(data);
      console.log(data?.data?.Diff?.Files);
    })();
  }, []);
  if (diffData == null) {
    return (
      <>
        <div></div>
      </>
    );
  }
  return (
    <>
      <div className="Comparison">
        <div className="md_contianer">
          <h3
            style={{
              padding: '.6rem .8rem',
              background: '#e6f1f6',
              borderBottom: '1px solid #ddd',
              fontWeight: 800,
            }}>
            {` ${diffData.data.Commit.Message}`}
          </h3>
          <div className="flex_align_center commit_info">
            <div className="flex_align_center commit_ins">
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span className="file_name_color margin_lefts">{` ${diffData.data.Commit.Committer.Name}`}</span>
              <span className="margin_lefts">{`<${diffData.data.Commit.Committer.Email}>`}</span>
              <span className="margin_lefts">
                {getTimeAgo(diffData.data.Commit.Committer.When)}
              </span>
            </div>
            <div>
              <span>父节点</span>
              <span className="margin_lefts git_verson2">{`${diffData.data.Parents[0]?.substring(
                0,
                10,
              )}`}</span>
              <span className="margin_lefts">当前提交</span>
              <span className="margin_lefts git_verson2">{` ${diffData.data.Commit.ID.substring(
                0,
                10,
              )}`}</span>
            </div>
          </div>
        </div>
        <div className="flex_align_center commit_ins_botton">
          <span>
            <RetweetOutlined style={{ fontSize: '20px', marginRight: '5px' }} />
            共有
            <span className="check">{` ${diffData?.data?.Diff?.Files.length} 个文件被更改`}</span>
            ,包括
            <span className="check">{` ${diffData.data.Diff.Changes.TotalAdditions} 次插入`}</span>
            和
            <span className="check">{` ${diffData.data.Diff.Changes.TotalDeletions} 次删除`}</span>
          </span>
          <div className="flex_align_center">
            <div
              className="flst"
              onClick={() => {
                setSplitView(!splitView);
              }}>
              {splitView ? '合并视图' : '分列视图'}
            </div>
            <div
              className="flst"
              onClick={() => {
                setExpandedItems([]);
              }}>
              {'收起全部'}
            </div>
          </div>
        </div>
        {diffData?.data?.Diff?.Files?.map((File: any, i: number) => {
          return (
            <div key={i}>
              <div className="file-diff-viewer">
                <div className="md_contianer filecontent">
                  <h3
                    style={{
                      padding: '0.6rem 0.8rem',
                      background: '#f0f0f0',
                      borderBottom: '1px solid #ddd',
                    }}>
                    <FileDoneOutlined style={{ marginRight: '.4rem' }} />
                    {(() => {
                      switch (File.Type) {
                        case 1:
                          return `${File.Name} 新建`;
                        case 2:
                          return `${File.Name} 更新`;
                        case 3:
                          return `${File.Name} 删除`;
                        default:
                          return `${File.Name}`;
                      }
                    })()}
                  </h3>
                  {(() => {
                    return (
                      <div>
                        <div
                          onClick={() => {
                            // setExpandedcontent(File.Sections.length);
                            if (expandedItems.includes(i)) {
                              setExpandedItems(
                                expandedItems.filter((item) => item !== i),
                              );
                            } else {
                              setExpandedItems([...expandedItems, i]);
                            }
                          }}>
                          {expandedItems.includes(i) ? '收起查看' : '展开查看'}
                          {/* <img
                              src={`/warehouse/13291512066/ceshi3/raw/dev/${File.Name}`}
                              alt=""
                            /> */}
                        </div>
                        {expandedItems.includes(i) &&
                          (() => {
                            if (!File.Sections.length) {
                              return (
                                <div
                                  onClick={() => {
                                    // console.log(val);
                                    console.log(File.Sections);
                                  }}>
                                  文件暂时无法查看
                                </div>
                              );
                            }
                            return File.Sections?.map((val, ind) => {
                              const leftContent = val.Lines?.filter(
                                (line, index) => line.Type !== 2 && index != 0,
                              )
                                .map((line) =>
                                  line.Content.replace(/^\+/, '').replace(/^-/, ''),
                                )
                                .join('\n');

                              const rightContent = val.Lines?.filter(
                                (line, index) => line.Type !== 3 && index != 0,
                              )
                                .map((line) =>
                                  line.Content.replace(/^\+/, '').replace(/^-/, ''),
                                )
                                .join('\n');
                              return (
                                <div key={ind}>
                                  <DiffViewer
                                    oldValue={leftContent} //新值
                                    newValue={rightContent} //旧值
                                    splitView={splitView} //单双视图
                                    disableWordDiff={true} //在差异行中显示和隐藏单词 diff
                                    compareMethod={DiffMethod.WORDS}
                                    hideLineNumbers={false} //显示和隐藏行号
                                    renderContent={(source) => {
                                      //自定义渲染内容
                                      return (
                                        <div>
                                          <span>{source}</span>
                                        </div>
                                      );
                                    }}
                                    onLineNumberClick={(
                                      //行号处理事件
                                      lineId: string,
                                      event: React.MouseEvent<
                                        HTMLTableCellElement,
                                        MouseEvent
                                      >,
                                    ) => {
                                      console.log(lineId, event);
                                      console.log(File.Sections);
                                    }}
                                    // highlightLines={['L-31', 'R-31']} //黄线 写法:'L-1','R-1'
                                    showDiffOnly={true} //仅显示差异线 并折叠 未更改的线
                                    extraLinesSurroundingDiff={3} //差异周围额外未更改的行数。与 showDiffOnly一起使用
                                    // codeFoldMessageRenderer={( //折叠信息渲染
                                    //   totalFoldedLines: number, //总计折叠
                                    //   leftStartLineNumber: number, //左侧
                                    //   rightStartLineNumber: number, //右侧
                                    // ) => {
                                    //   return <div>1111</div>;
                                    // }}
                                    // styles={newStyles} //自定义修改内部样式
                                    leftTitle={
                                      <div>
                                        <div>
                                          <div>{val.Lines[0].Content}</div>
                                        </div>
                                      </div>
                                    } //左侧顶部标题
                                    // rightTitle={'11111'} //右侧顶部标题
                                    linesOffset={
                                      val.Lines[1].LeftLine
                                        ? val.Lines[1].LeftLine - 1
                                        : 0
                                    } //开始行号
                                  />
                                </div>
                              );
                            });
                          })()}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CodeComparison;
