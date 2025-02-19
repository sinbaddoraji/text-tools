import React, { useState } from 'react';
import { Input, Switch, Row, Col } from 'antd';

const { TextArea } = Input;

const ReverseText: React.FC = () => {
  const [text, setText] = useState('');

  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const [isUppercase, setIsUppercase] = useState(true);

  const handleSwitchChange = (checked: boolean) => {
    setIsUppercase(checked);
    if (checked) {
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
        <Switch
            checkedChildren="Upper"
            unCheckedChildren="Lower"
            checked={isUppercase}
            onChange={handleSwitchChange}
            style={{ marginBottom: '10px' }}
          />
        </Col>
      </Row>
  );
};

export default ReverseText;