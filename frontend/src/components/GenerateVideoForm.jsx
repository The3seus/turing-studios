import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const GenerateVideoForm = ({ visible, onCreate, onCancel, loading }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onCreate(values);
  };

  return (
    <Modal
      visible={visible}
      title="Generate Video"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Generate
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="description"
          label="Video Script"
          rules={[{ required: true, message: 'Please enter the video script' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="voiceOverScript"
          label="Voice Over Script"
          rules={[{ required: true, message: 'Please enter the voice over script' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="platform"
          label="Video Platform"
          rules={[{ required: true, message: 'Please select a video platform' }]}
        >
          <Select>
            <Option value="tiktok">TikTok</Option>
            <Option value="youtube">YouTube</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="duration"
          label="Video Duration (minutes)"
          rules={[{ required: true, message: 'Please select a video duration' }]}
        >
          <Select>
            {Array.from({ length: 10 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1} minute{i > 0 ? 's' : ''}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GenerateVideoForm;
