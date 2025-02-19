import React, { useState } from 'react';
import { Input, Switch, Row, Col, Button, Space, Flex } from 'antd';

const { TextArea } = Input;

const UpperLower: React.FC = () => {
  const [text, setText] = useState('');
  const [isUppercase, setIsUppercase] = useState(true);

  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const handleReverse = () => {
    setText(text.split('').reverse().join(''));
  };

  const handleTrim = () => {
    setText(text.trim());
  };

  const handleSwitchChange = () => {
    setIsUppercase(!isUppercase);

    if (isUppercase) {
      handleUppercase();
    } else {
      handleLowercase();
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <TextArea
          showCount
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          placeholder="Enter your text here"
          style={{ width: '100%', height: '60vh' }}
        />
      </Col>
      <Col span={24}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row justify="start" gutter={[16, 16]}>
            <Col>
              <Button onClick={handleSwitchChange}>
          Invert Case
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReverse}>
          Reverse Text
              </Button>
            </Col>
            <Col>
              <Button onClick={handleTrim}>
          Trim Text
              </Button>
            </Col>
          </Row>
        </Space>
      </Col>
    </Row>
  );
};

export default UpperLower;