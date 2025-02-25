import { useState } from 'react';
import { Input, Button, Space, Alert } from 'antd';

const PalindromeChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [isPalindrome, setIsPalindrome] = useState(false);
  const [result, setResult] = useState('');

  const checkPalindrome = () => {
    const cleanText = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const reversedText = cleanText.split('').reverse().join('');
    if (cleanText === reversedText) {
      setIsPalindrome(true);
      setResult('This is a palindrome');
    } else {
      setIsPalindrome(false);
      setResult('This is not a palindrome');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to check"
        rows={4}
      />
      <Button onClick={checkPalindrome}>Check Palindrome</Button>
      {result && (
        <Alert
          message={result}
          type={isPalindrome ? 'success' : 'error'}
        />
      )}
    </Space>
  );
};

export default PalindromeChecker;