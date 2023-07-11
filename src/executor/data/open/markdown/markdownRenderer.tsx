import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface IProps {
  markdownUrl: string;
}
const MarkdownRenderer: React.FC<IProps> = ({ markdownUrl }) => {
  const [markdown, setMarkdown] = useState('');
  useEffect(() => {
    fetch(markdownUrl)
      .then((response) => response.text())
      .then((data) => setMarkdown(data))
      .catch((error) => {
        console.error('Error fetching file:', error);
      });
  }, [markdownUrl]);

  return (
    <div>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
