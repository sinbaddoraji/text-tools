import { useState } from 'react';
import { Input, Button, Space } from 'antd';

const Base64Encoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');

  const handleEncode = () => {
    setEncoded(btoa(input));
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to encode"
        rows={4}
      />
      <Button onClick={handleEncode}>Encode to Base64</Button>
      <Input
        value={encoded}
        placeholder="Base64 encoded result"
        readOnly
      />
    </Space>
  );
};

export default Base64Encoder;