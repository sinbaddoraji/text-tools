import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Card, Select, Space, DatePicker, TimePicker } from 'antd';
import { 
  ReloadOutlined, 
  CopyOutlined, 
  ClearOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [timezone, setTimezone] = useState('UTC');
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [messageApi, contextHolder] = message.useMessage();

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney'
  ];

  const formats = [
    { label: 'Unix Timestamp (seconds)', value: 'unix', example: '1640995200' },
    { label: 'Unix Timestamp (milliseconds)', value: 'unix_ms', example: '1640995200000' },
    { label: 'ISO 8601', value: 'iso', example: '2022-01-01T00:00:00.000Z' },
    { label: 'RFC 2822', value: 'rfc', example: 'Sat, 01 Jan 2022 00:00:00 +0000' },
    { label: 'Human Readable', value: 'human', example: 'January 1, 2022 12:00:00 AM' },
    { label: 'Date Only', value: 'date', example: '2022-01-01' },
    { label: 'Time Only', value: 'time', example: '00:00:00' },
    { label: 'Custom Format', value: 'custom', example: 'YYYY-MM-DD HH:mm:ss' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const parseTimestamp = (input: string): dayjs.Dayjs | null => {
    if (!input.trim()) return null;

    // Try parsing as Unix timestamp (seconds)
    if (/^\d{10}$/.test(input)) {
      return dayjs.unix(parseInt(input));
    }

    // Try parsing as Unix timestamp (milliseconds)
    if (/^\d{13}$/.test(input)) {
      return dayjs(parseInt(input));
    }

    // Try parsing as ISO string
    const parsed = dayjs(input);
    return parsed.isValid() ? parsed : null;
  };

  const formatTimestamp = (date: dayjs.Dayjs, format: string, tz: string = 'UTC'): string => {
    const dateInTz = tz === 'UTC' ? date.utc() : date.tz(tz);
    
    switch (format) {
      case 'unix':
        return dateInTz.unix().toString();
      case 'unix_ms':
        return dateInTz.valueOf().toString();
      case 'iso':
        return dateInTz.toISOString();
      case 'rfc':
        return dateInTz.format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      case 'human':
        return dateInTz.format('MMMM D, YYYY h:mm:ss A');
      case 'date':
        return dateInTz.format('YYYY-MM-DD');
      case 'time':
        return dateInTz.format('HH:mm:ss');
      case 'custom':
        return dateInTz.format('YYYY-MM-DD HH:mm:ss');
      default:
        return dateInTz.toString();
    }
  };

  const handleTimestampInput = (value: string) => {
    setTimestamp(value);
    const parsed = parseTimestamp(value);
    if (parsed) {
      setSelectedDate(parsed);
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setTimestamp(date.unix().toString());
    }
  };

  const handleNow = () => {
    const now = dayjs();
    setSelectedDate(now);
    setTimestamp(now.unix().toString());
    messageApi.success('Set to current time');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setTimestamp('');
    setSelectedDate(dayjs());
    messageApi.info('Cleared');
  };

  const parsedDate = parseTimestamp(timestamp);

  return (
    <PageWrapper
      title="Timestamp Converter"
      description="Convert between different timestamp formats and timezones with real-time preview."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <Card title="Current Time" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Local Time</div>
                  <div style={{ fontSize: '18px', fontFamily: 'monospace' }}>
                    {currentTime.format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Unix Timestamp</div>
                  <div style={{ fontSize: '18px', fontFamily: 'monospace' }}>
                    {currentTime.unix()}
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(currentTime.unix().toString())}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">Input Timestamp</div>
              <Input
                value={timestamp}
                onChange={(e) => handleTimestampInput(e.target.value)}
                placeholder="Enter Unix timestamp, ISO string, or any date format..."
                style={{ fontSize: '16px', fontFamily: 'monospace' }}
                size="large"
              />
              <div style={{ marginTop: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <div style={{ marginBottom: '8px', fontWeight: 600 }}>Or select date/time:</div>
                    <Space>
                      <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                      <TimePicker
                        value={selectedDate}
                        onChange={(time) => {
                          if (time) {
                            const newDate = selectedDate.hour(time.hour()).minute(time.minute()).second(time.second());
                            handleDateChange(newDate);
                          }
                        }}
                      />
                    </Space>
                  </div>
                  <Button icon={<ClockCircleOutlined />} onClick={handleNow}>
                    Use Current Time
                  </Button>
                </Space>
              </div>
            </div>
            
            <div className="output-section">
              <div className="section-label">Timezone</div>
              <Select
                value={timezone}
                onChange={setTimezone}
                style={{ width: '100%', marginBottom: '16px' }}
              >
                {timezones.map(tz => (
                  <Option key={tz} value={tz}>{tz}</Option>
                ))}
              </Select>
              
              {parsedDate && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '12px' }}>
                    Converted Time ({timezone})
                  </div>
                  <div style={{ fontSize: '16px', fontFamily: 'monospace', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    {timezone === 'UTC' 
                      ? parsedDate.utc().format('YYYY-MM-DD HH:mm:ss [UTC]')
                      : parsedDate.tz(timezone).format('YYYY-MM-DD HH:mm:ss')
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>

        {parsedDate && (
          <Col span={24}>
            <Card title="All Formats" size="small">
              <Row gutter={[16, 16]}>
                {formats.map((format) => (
                  <Col xs={24} sm={12} lg={8} key={format.value}>
                    <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{format.label}</span>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<CopyOutlined />}
                          onClick={() => handleCopy(formatTimestamp(parsedDate, format.value, timezone))}
                        />
                      </div>
                      <div style={{ fontSize: '14px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {formatTimestamp(parsedDate, format.value, timezone)}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<ClockCircleOutlined />}
              onClick={handleNow}
              className="btn"
            >
              Current Time
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!timestamp}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Card title="Format Examples" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Supported Input Formats:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Unix timestamp (seconds): 1640995200</li>
                    <li>Unix timestamp (milliseconds): 1640995200000</li>
                    <li>ISO 8601: 2022-01-01T00:00:00.000Z</li>
                    <li>Human readable: January 1, 2022</li>
                    <li>Common formats: 2022-01-01, 01/01/2022</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Timezone Notes:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>UTC: Coordinated Universal Time</li>
                    <li>Local timezones show offset from UTC</li>
                    <li>Daylight saving time is automatically handled</li>
                    <li>Unix timestamps are always in UTC</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default TimestampConverter;