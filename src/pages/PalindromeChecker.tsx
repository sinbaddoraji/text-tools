import { useState } from 'react';
import { Input, Button, Alert, Row, Col, message, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;

const PalindromeChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [isPalindrome, setIsPalindrome] = useState<boolean | null>(null);
  const [cleanedText, setCleanedText] = useState('');
  const [reversedText, setReversedText] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const checkPalindrome = () => {
    if (!text.trim()) {
      messageApi.warning('Please enter some text to check');
      return;
    }

    const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const reversed = cleaned.split('').reverse().join('');
    
    setCleanedText(cleaned);
    setReversedText(reversed);
    setIsPalindrome(cleaned === reversed && cleaned.length > 0);
    
    if (cleaned === reversed && cleaned.length > 0) {
      messageApi.success('Palindrome detected!');
    } else {
      messageApi.info('Not a palindrome');
    }
  };

  const handleClear = () => {
    setText('');
    setIsPalindrome(null);
    setCleanedText('');
    setReversedText('');
    messageApi.info('Cleared');
  };

  const examplePalindromes = [
    'A man, a plan, a canal: Panama',
    'race a car',
    'hello',
    'Madam',
    'Was it a car or a cat I saw?',
    'Never odd or even'
  ];

  const handleExample = (example: string) => {
    setText(example);
    setIsPalindrome(null);
    setCleanedText('');
    setReversedText('');
  };

  return (
    <PageWrapper
      title="Palindrome Checker"
      description="Check if a word, phrase, or sequence reads the same backward as forward."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="single-input-container">
            <div className="input-section">
              <div className="section-label">Enter Text</div>
              <TextArea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setIsPalindrome(null);
                }}
                placeholder="Enter a word or phrase to check if it's a palindrome..."
                style={{ minHeight: '120px', fontSize: '16px' }}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<SearchOutlined />}
              onClick={checkPalindrome}
              disabled={!text}
              className="btn"
            >
              Check Palindrome
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!text}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>

        {isPalindrome !== null && cleanedText && (
          <Col span={24}>
            <Alert
              message={
                <div style={{ fontSize: '16px' }}>
                  {isPalindrome ? (
                    <>
                      <CheckCircleOutlined style={{ marginRight: 8 }} />
                      Yes, this is a palindrome!
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined style={{ marginRight: 8 }} />
                      No, this is not a palindrome.
                    </>
                  )}
                </div>
              }
              description={
                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Cleaned text:</strong> <code style={{ fontSize: '14px' }}>{cleanedText}</code>
                  </div>
                  <div>
                    <strong>Reversed text:</strong> <code style={{ fontSize: '14px' }}>{reversedText}</code>
                  </div>
                </div>
              }
              type={isPalindrome ? 'success' : 'error'}
              showIcon
              style={{ marginTop: 16 }}
            />
          </Col>
        )}

        <Col span={24}>
          <div className="example-section">
            <div className="section-label">Try these examples:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {examplePalindromes.map((example, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '14px' }}
                  onClick={() => handleExample(example)}
                >
                  {example}
                </Tag>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default PalindromeChecker;