import { useState } from 'react';
import { Input, Button, Space } from 'antd';

const URLEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');

  const handleEncode = () => {
    setEncoded(encodeURIComponent(input));
  };

  const handleDecode = () => {
    setDecoded(decodeURIComponent(input));
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter URL to encode/decode"
        rows={4}
      />
      <Space>
        <Button onClick={handleEncode}>Encode</Button>
        <Button onClick={handleDecode}>Decode</Button>
      </Space>
      <Input
        value={encoded}
        placeholder="Encoded URL"
        readOnly
      />
      <Input
        value={decoded}
        placeholder="Decoded URL"
        readOnly
      />
    </Space>
  );
};

export default URLEncoderDecoder;