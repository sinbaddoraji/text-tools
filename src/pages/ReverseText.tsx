import React, { useState } from 'react';
import { Input, Button, Row, Col, message, Radio } from 'antd';
import { SwapOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;

const ReverseText: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [reverseType, setReverseType] = useState<'characters' | 'words' | 'lines'>('characters');
  const [messageApi, contextHolder] = message.useMessage();

  const handleReverse = () => {
    if (!input.trim()) {
      messageApi.warning('Please enter some text to reverse');
      return;
    }

    let reversed = '';
    
    switch (reverseType) {
      case 'characters':
        reversed = input.split('').reverse().join('');
        break;
      case 'words':
        reversed = input.split(/\s+/).reverse().join(' ');
        break;
      case 'lines':
        reversed = input.split('\n').reverse().join('\n');
        break;
    }
    
    setOutput(reversed);
    messageApi.success(`Text reversed by ${reverseType}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    messageApi.info('Cleared');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-reverse as user types
    let reversed = '';
    const value = e.target.value;
    
    switch (reverseType) {
      case 'characters':
        reversed = value.split('').reverse().join('');
        break;
      case 'words':
        reversed = value.split(/\s+/).reverse().join(' ');
        break;
      case 'lines':
        reversed = value.split('\n').reverse().join('\n');
        break;
    }
    
    setOutput(reversed);
  };

  return (
    <PageWrapper
      title="Text Reverser"
      description="Reverse text by characters, words, or lines with real-time preview."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="section-label">Reverse Type</div>
          <Radio.Group 
            value={reverseType} 
            onChange={(e) => {
              setReverseType(e.target.value);
              // Re-reverse with new type if there's input
              if (input) {
                setInput(current => current); // Trigger re-reverse
                handleInputChange({ target: { value: input } } as React.ChangeEvent<HTMLTextAreaElement>);
              }
            }}
            size="large"
          >
            <Radio.Button value="characters">Characters</Radio.Button>
            <Radio.Button value="words">Words</Radio.Button>
            <Radio.Button value="lines">Lines</Radio.Button>
          </Radio.Group>
        </Col>

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">Original Text</div>
              <TextArea
                value={input}
                onChange={handleInputChange}
                placeholder={
                  reverseType === 'characters' 
                    ? "Enter text to reverse character by character..."
                    : reverseType === 'words'
                    ? "Enter text to reverse word by word..."
                    : "Enter text to reverse line by line..."
                }
                style={{ minHeight: '200px', fontSize: '14px' }}
                autoSize={{ minRows: 8, maxRows: 15 }}
              />
            </div>
            <div className="output-section">
              <div className="section-label">Reversed Text</div>
              <TextArea
                value={output}
                placeholder="Reversed text will appear here..."
                readOnly
                style={{ minHeight: '200px', fontSize: '14px' }}
                autoSize={{ minRows: 8, maxRows: 15 }}
              />
            </div>
          </div>
        </Col>
        
        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<SwapOutlined />}
              onClick={handleReverse}
              disabled={!input}
            >
              Reverse Text
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!output}
            >
              Copy Result
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!input && !output}
            >
              Clear
            </Button>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default ReverseText;