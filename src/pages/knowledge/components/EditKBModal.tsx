import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, ColorPicker, Button, message } from 'antd';
import { useKnowledgeStore } from '@/store/useKnowledgeStore';
import type { KnowledgeBase } from '@/types/knowledge';

const { TextArea } = Input;

const iconOptions = [
  { label: '📚 文件', value: 'FileTextOutlined' },
  { label: '🏢 企业', value: 'BankOutlined' },
  { label: '📊 销售', value: 'BarChartOutlined' },
  { label: '👥 团队', value: 'TeamOutlined' },
  { label: '🎯 KPI', value: 'TargetOutlined' },
];

interface EditKBModalProps {
  open: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBase | null;
}

const EditKBModal: React.FC<EditKBModalProps> = ({ open, onClose, knowledgeBase }) => {
  const [form] = Form.useForm();
  const { knowledgeBases, setKnowledgeBases } = useKnowledgeStore();

  useEffect(() => {
    if (knowledgeBase && open) {
      form.setFieldsValue({
        name: knowledgeBase.name,
        description: knowledgeBase.description,
        icon: knowledgeBase.icon,
        color: knowledgeBase.color,
      });
    }
  }, [knowledgeBase, open, form]);

  const handleSubmit = async () => {
    if (!knowledgeBase) return;

    try {
      const values = await form.validateFields();

      const updatedBases = knowledgeBases.map(kb => {
        if (kb.id === knowledgeBase.id) {
          return {
            ...kb,
            name: values.name,
            description: values.description,
            icon: values.icon,
            color: values.color?.toHexString() || kb.color,
            updatedAt: new Date().toISOString(),
          };
        }
        return kb;
      });

      setKnowledgeBases(updatedBases);
      message.success('知识库更新成功！');
      onClose();
    } catch (error) {
      console.error('更新知识库失败:', error);
    }
  };

  return (
    <Modal
      title="编辑知识库"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          保存修改
        </Button>,
      ]}
      width={520}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="知识库名称"
          rules={[{ required: true, message: '请输入知识库名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={3} />
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

export default EditKBModal;
