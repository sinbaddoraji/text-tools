import React, { useState } from 'react';
import { Input, Row, Col, Button, Space } from 'antd';

const { TextArea } = Input;

const SlugGenerator: React.FC = () => {
  const [text, setText] = useState('');
  
  const [slugifyText, setSlugifyText] = useState('-');

  const handleSlugify = () => {
    setText(text.replace(/ /g, slugifyText));
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <TextArea
          showCount
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          placeholder="Enter your text here"
          style={{ width: '100%', height: '10vh' }}
        />
      </Col>
      <Col span={24}>
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row justify="start" gutter={[16, 16]}>
            <Col>
              <Button onClick={handleSlugify}>
                Slugify
              </Button>
            </Col>
            <Col>
              <Input
                value={slugifyText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlugifyText(e.target.value)}
                placeholder="Slugify Text"
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Space>

      </Col>
    </Row>
  );
};

export default SlugGenerator;