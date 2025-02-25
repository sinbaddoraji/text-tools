import { useState } from 'react';
import { Input, Button, Space } from 'antd';

const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormats] = useState('');

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setFormats('');
        return;
      }
      const obj = JSON.parse(input);
      setFormats(JSON.stringify(obj, null, 2));
    } catch (error) {
      alert('Invalid JSON');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter JSON to format"
        rows={4}
      />
      <Button onClick={handleFormat}>Format JSON</Button>
      <Input.TextArea
        value={formatted}
        placeholder="Formatted JSON"
        readOnly
      />
    </Space>
  );
};

export default JSONFormatter;