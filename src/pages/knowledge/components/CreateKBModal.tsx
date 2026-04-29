import React, { useState } from 'react';
import { Modal, Form, Input, Select, ColorPicker, Button, message } from 'antd';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';
import type { KnowledgeBase } from '@/types/knowledge';

const { TextArea } = Input;

interface CreateKBModalProps {
  open: boolean;
  onClose: () => void;
}

const iconOptions = [
  { label: '📚 文件', value: 'FileTextOutlined' },
  { label: '🏢 企业', value: 'BankOutlined' },
  { label: '📊 销售', value: 'BarChartOutlined' },
  { label: '👥 团队', value: 'TeamOutlined' },
  { label: '🎯 KPI', value: 'TargetOutlined' },
];

const CreateKBModal: React.FC<CreateKBModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addKnowledgeBase } = useKnowledgeStore();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const newKB: KnowledgeBase = {
        id: `kb_${Date.now()}`,
        name: values.name,
        description: values.description,
        icon: values.icon,
        color: values.color?.toHexString ? values.color.toHexString() : (typeof values.color === 'string' ? values.color : '#1890ff'),
        fileCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addKnowledgeBase(newKB);
      message.success('知识库创建成功！');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('创建知识库失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="新建知识库"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="创建知识库"
      cancelText="取消"
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          icon: 'FileTextOutlined',
          color: '#1890ff',
        }}
      >
        <Form.Item
          name="name"
          label="知识库名称"
          rules={[
            { required: true, message: '请输入知识库名称' },
            { min: 2, max: 50, message: '名称长度需在2-50字符之间' }
          ]}
        >
          <Input placeholder="例如：企业培训知识库" />
        </Form.Item>

        <Form.Item name="description" label="描述（可选）">
          <TextArea 
            rows={3} 
            placeholder="描述该知识库的主要内容和用途..." 
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="icon" label="图标">
            <Select options={iconOptions} />
          </Form.Item>

          <Form.Item name="color" label="主题色">
            <ColorPicker showText />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateKBModal;
