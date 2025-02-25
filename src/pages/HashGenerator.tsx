import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';

const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256'); // Using SHA-256 as an example

  const handleGenerate = async () => {
    if (!input.trim()) {
      alert('Please enter text to hash');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
      setHash(hashHex);
    } catch (error) {
      alert('Error generating hash');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to generate hash"
        rows={4}
      />
      <Space>
        <Select value={algorithm} onChange={setAlgorithm}>
          <Select.Option value="SHA-1">SHA-1</Select.Option>
          <Select.Option value="SHA-256">SHA-256</Select.Option>
          <Select.Option value="SHA-512">SHA-512</Select.Option>
        </Select>
        <Button onClick={handleGenerate}>Generate Hash</Button>
      </Space>
      <Input
        value={hash}
        placeholder="Generated Hash"
        readOnly
      />
    </Space>
  );
};

export default HashGenerator;