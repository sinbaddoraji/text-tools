import { useState } from 'react';
import { Input, Button, Space, Slider } from 'antd';

const RandomStringGenerator: React.FC = () => {
  const [randomString, setRandomString] = useState('');
  const [length, setLength] = useState(10);

  const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setRandomString(result);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Slider
        value={length}
        onChange={(value) => setLength(value)}
        min={5}
        max={50}
        tipFormatter={(value) => `Length: ${value}`}
      />
      <Button onClick={generateRandomString}>Generate Random String</Button>
      <Input
        value={randomString}
        placeholder="Random String"
        readOnly
      />
    </Space>
  );
};

export default RandomStringGenerator;