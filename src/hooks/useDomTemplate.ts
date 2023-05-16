import ReactDOM from 'react-dom';
/**
 * @desc: react传送门 ---将内容插入指定id节点
 * @param {string} id extraTempalte DialogTempalte
 * @param {React} content
 */
const useDomTemplate = (id: string, content: React.ReactNode) => {
  const DOM = document.getElementById(id);
  if (!DOM) {
    return '';
  }
  return ReactDOM.createPortal(content, DOM);
};
export default useDomTemplate;
