import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface PageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <Title level={2} className="page-title">{title}</Title>
        <Paragraph className="page-description">
          {description}
        </Paragraph>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;