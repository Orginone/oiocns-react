import React, { useEffect, useState } from 'react';
import JSONView from 'react-json-view';
interface IProps {
  jsonUrl: string;
}
const JsonRenderer: React.FC<IProps> = ({ jsonUrl }) => {
  const [jsonData, setJsonData] = useState(null);
  useEffect(() => {
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((data) => setJsonData(data))
      .catch((error) => {
        console.error('Error fetching file:', error);
      });
  }, [jsonUrl]);

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <JSONView src={jsonData} />
    </div>
  );
};

export default JsonRenderer;
