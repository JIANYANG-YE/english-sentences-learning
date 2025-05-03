import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Upload, Progress, Divider, Space, Switch, Radio, Tooltip, message, Card, Select, InputNumber, List, Typography } from 'antd';
import { UploadOutlined, LinkOutlined, FileTextOutlined, DeleteOutlined, PlusOutlined, CloseCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { 
  ImportSource, 
  ImportSourceType, 
  BatchImportOptions, 
  ImportJobStatus, 
  ImportStatus,
  ContentSplittingStrategy 
} from '@/types/courses/importTypes';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface BatchImporterProps {
  onImportComplete?: (result: ImportJobStatus) => void;
  onCancel?: () => void;
  defaultOptions?: Partial<BatchImportOptions>;
  targetCourseId?: string;
}

/**
 * 批量内容导入组件
 * 
 * 允许用户通过文件上传、URL输入或文本粘贴来导入学习内容
 * 支持批量处理、质量检查和内容自动拆分
 */
export const BatchImporter: React.FC<BatchImporterProps> = ({
  onImportComplete,
  onCancel,
  defaultOptions,
  targetCourseId
}) => {
  // 引用
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<Input>(null);
  const textAreaRef = useRef<any>(null);

  // 状态管理
  const [sources, setSources] = useState<ImportSource[]>([]);
  const [jobId, setJobId] = useState<string>('');
  const [jobStatus, setJobStatus] = useState<ImportJobStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ImportSourceType>('file');

  // 导入选项
  const [importOptions, setImportOptions] = useState<BatchImportOptions>({
    parallelLimit: 3,
    continueOnError: true,
    qualityCheck: true,
    autoCategories: true,
    contentSplitting: 'auto',
    maxSentencesPerLesson: 30,
    targetCourseId: targetCourseId
  });

  // 初始化导入选项
  useEffect(() => {
    if (defaultOptions) {
      setImportOptions(prev => ({
        ...prev,
        ...defaultOptions
      }));
    }
  }, [defaultOptions]);

  // 模拟导入作业状态检查
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (jobId && jobStatus && jobStatus.status === 'processing') {
      interval = setInterval(() => {
        // 模拟进度更新
        setJobStatus(prev => {
          if (!prev) return null;
          
          const newProgress = Math.min(prev.progress + 5, 100);
          const newStatus: ImportStatus = newProgress >= 100 ? 'completed' : 'processing';
          
          return {
            ...prev,
            progress: newProgress,
            status: newStatus,
            endTime: newStatus === 'completed' ? Date.now() : undefined
          };
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, jobStatus]);

  // 清理作业状态
  useEffect(() => {
    if (jobStatus && jobStatus.status === 'completed' && onImportComplete) {
      onImportComplete(jobStatus);
    }
  }, [jobStatus, onImportComplete]);

  /**
   * 处理文件选择
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newSources: ImportSource[] = Array.from(files).map(file => ({
      id: uuidv4(),
      type: 'file',
      path: file.name,
      metadata: {
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    }));
    
    setSources(prev => [...prev, ...newSources]);
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 添加URL
   */
  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      message.error('请输入有效的URL');
      return;
    }
    
    const newSource: ImportSource = {
      id: uuidv4(),
      type: 'url',
      url: urlInput.trim()
    };
    
    setSources(prev => [...prev, newSource]);
    setUrlInput('');
    
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  };

  /**
   * 添加文本
   */
  const handleAddText = () => {
    if (!textInput.trim()) {
      message.error('请输入文本内容');
      return;
    }
    
    const newSource: ImportSource = {
      id: uuidv4(),
      type: 'text',
      content: textInput.trim(),
      metadata: {
        charCount: textInput.length,
        wordCount: textInput.split(/\s+/).filter(Boolean).length
      }
    };
    
    setSources(prev => [...prev, newSource]);
    setTextInput('');
    
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  /**
   * 移除源
   */
  const handleRemoveSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
  };

  /**
   * 清空所有源
   */
  const handleClearSources = () => {
    setSources([]);
  };

  /**
   * 开始导入
   */
  const handleStartImport = () => {
    if (sources.length === 0) {
      message.error('请至少添加一个导入源');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 模拟导入作业创建
    const newJobId = uuidv4();
    setJobId(newJobId);
    
    setJobStatus({
      jobId: newJobId,
      status: 'processing',
      progress: 0,
      startTime: Date.now()
    });
    
    // 模拟延迟
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  /**
   * 取消导入
   */
  const handleCancelImport = () => {
    if (jobStatus && (jobStatus.status === 'pending' || jobStatus.status === 'processing')) {
      setJobStatus(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'failed',
          endTime: Date.now()
        };
      });
    }
    
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * 更新导入选项
   */
  const updateImportOption = <K extends keyof BatchImportOptions>(
    key: K, 
    value: BatchImportOptions[K]
  ) => {
    setImportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * 渲染源类型标签
   */
  const renderSourceTypeTag = (type: ImportSourceType) => {
    switch (type) {
      case 'file':
        return <Text type="secondary"><FileTextOutlined /> 文件</Text>;
      case 'url':
        return <Text type="secondary"><LinkOutlined /> URL</Text>;
      case 'text':
        return <Text type="secondary"><FileTextOutlined /> 文本</Text>;
      default:
        return null;
    }
  };

  /**
   * 渲染导入源
   */
  const renderSourceItem = (source: ImportSource) => {
    const name = source.path || source.url || '文本内容';
    const description = source.type === 'text' 
      ? `${(source.metadata?.charCount || 0).toLocaleString()} 字符` 
      : source.type === 'file' 
        ? `${(source.metadata?.size ? Math.round((source.metadata?.size as number) / 1024) : 0).toLocaleString()} KB` 
        : source.url;
    
    return (
      <List.Item
        actions={[
          <Button 
            key="delete" 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleRemoveSource(source.id)}
            disabled={loading || (jobStatus?.status === 'processing')}
          />
        ]}
      >
        <List.Item.Meta
          title={name}
          description={
            <Space>
              {renderSourceTypeTag(source.type)}
              <Text type="secondary">{description}</Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  /**
   * 渲染导入作业状态
   */
  const renderJobStatus = () => {
    if (!jobStatus) return null;
    
    let statusIcon;
    let statusText;
    let statusColor;
    
    switch (jobStatus.status) {
      case 'pending':
        statusIcon = <LoadingOutlined />;
        statusText = '等待处理';
        statusColor = 'orange';
        break;
      case 'processing':
        statusIcon = <LoadingOutlined />;
        statusText = '处理中';
        statusColor = 'blue';
        break;
      case 'completed':
        statusIcon = <CheckCircleOutlined />;
        statusText = '已完成';
        statusColor = 'green';
        break;
      case 'failed':
        statusIcon = <CloseCircleOutlined />;
        statusText = '失败';
        statusColor = 'red';
        break;
    }
    
    return (
      <Card className="mt-4">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Text style={{ color: statusColor }}>{statusIcon} {statusText}</Text>
            <Text type="secondary">
              {jobStatus.endTime 
                ? `耗时: ${Math.round((jobStatus.endTime - jobStatus.startTime) / 1000)}秒`
                : `开始时间: ${new Date(jobStatus.startTime).toLocaleTimeString()}`}
            </Text>
          </Space>
          
          <Progress 
            percent={jobStatus.progress} 
            status={jobStatus.status === 'failed' ? 'exception' : undefined}
            strokeColor={statusColor}
          />
          
          {jobStatus.errors && jobStatus.errors.length > 0 && (
            <div>
              <Title level={5}>错误 ({jobStatus.errors.length})</Title>
              <List
                size="small"
                dataSource={jobStatus.errors}
                renderItem={error => (
                  <List.Item>
                    <Text type="danger">{error.sourceId}: {error.error}</Text>
                  </List.Item>
                )}
              />
            </div>
          )}
          
          {jobStatus.status === 'completed' && (
            <Button type="primary" onClick={() => onImportComplete && onImportComplete(jobStatus)}>
              查看结果
            </Button>
          )}
        </Space>
      </Card>
    );
  };

  return (
    <div className="batch-importer">
      <Title level={4}>批量内容导入</Title>
      <Paragraph>添加文件、URL或文本内容进行批量导入和处理。</Paragraph>
      
      {!jobStatus && (
        <>
          <Card className="mb-4">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Radio.Group 
                  value={activeTab}
                  onChange={e => setActiveTab(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="file">文件上传</Radio.Button>
                  <Radio.Button value="url">URL导入</Radio.Button>
                  <Radio.Button value="text">文本输入</Radio.Button>
                </Radio.Group>
              </div>
              
              <div className="mt-3">
                {activeTab === 'file' && (
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".txt,.pdf,.doc,.docx,.html,.md"
                    />
                    <Button 
                      icon={<UploadOutlined />} 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      选择文件
                    </Button>
                    <Text type="secondary" className="ml-2">
                      支持 TXT, PDF, DOC, DOCX, HTML, MD 文件
                    </Text>
                  </div>
                )}
                
                {activeTab === 'url' && (
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="输入URL地址"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onPressEnter={handleAddUrl}
                      ref={urlInputRef}
                      disabled={loading}
                    />
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddUrl}
                      disabled={loading || !urlInput.trim()}
                    >
                      添加
                    </Button>
                  </Space.Compact>
                )}
                
                {activeTab === 'text' && (
                  <div>
                    <TextArea
                      placeholder="输入或粘贴文本内容"
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      rows={6}
                      ref={textAreaRef}
                      disabled={loading}
                    />
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddText}
                      className="mt-2"
                      disabled={loading || !textInput.trim()}
                    >
                      添加
                    </Button>
                  </div>
                )}
              </div>
            </Space>
          </Card>
          
          {sources.length > 0 && (
            <Card className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Title level={5}>导入源 ({sources.length})</Title>
                <Button 
                  type="text" 
                  danger 
                  onClick={handleClearSources}
                  disabled={loading}
                >
                  清空
                </Button>
              </div>
              
              <List
                size="small"
                dataSource={sources}
                renderItem={renderSourceItem}
                bordered
              />
            </Card>
          )}
          
          <Card className="mb-4">
            <Title level={5}>导入选项</Title>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text>质量检查</Text>
                <div>
                  <Switch
                    checked={importOptions.qualityCheck}
                    onChange={value => updateImportOption('qualityCheck', value)}
                    disabled={loading}
                  />
                  <Text type="secondary" className="ml-2">
                    检查导入内容的质量和可读性
                  </Text>
                </div>
              </div>
              
              <div>
                <Text>自动分类</Text>
                <div>
                  <Switch
                    checked={importOptions.autoCategories}
                    onChange={value => updateImportOption('autoCategories', value)}
                    disabled={loading}
                  />
                  <Text type="secondary" className="ml-2">
                    自动分析和标记内容类别
                  </Text>
                </div>
              </div>
              
              <div>
                <Text>内容拆分策略</Text>
                <div>
                  <Select
                    value={importOptions.contentSplitting}
                    onChange={(value: ContentSplittingStrategy) => updateImportOption('contentSplitting', value)}
                    style={{ width: '100%' }}
                    disabled={loading}
                  >
                    <Option value="auto">自动（按照内容结构）</Option>
                    <Option value="fixed">固定长度</Option>
                    <Option value="none">不拆分</Option>
                  </Select>
                </div>
              </div>
              
              {importOptions.contentSplitting === 'fixed' && (
                <div>
                  <Text>每节课句子数</Text>
                  <div>
                    <InputNumber
                      value={importOptions.maxSentencesPerLesson}
                      onChange={value => updateImportOption('maxSentencesPerLesson', value as number)}
                      min={5}
                      max={100}
                      style={{ width: '100%' }}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Text>错误处理</Text>
                <div>
                  <Switch
                    checked={importOptions.continueOnError}
                    onChange={value => updateImportOption('continueOnError', value)}
                    disabled={loading}
                  />
                  <Text type="secondary" className="ml-2">
                    遇到错误时继续处理其他内容
                  </Text>
                </div>
              </div>
              
              <div>
                <Text>并行处理限制</Text>
                <div>
                  <InputNumber
                    value={importOptions.parallelLimit}
                    onChange={value => updateImportOption('parallelLimit', value as number)}
                    min={1}
                    max={10}
                    style={{ width: '100%' }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          <div className="d-flex justify-content-between">
            <Button onClick={onCancel} disabled={loading}>
              取消
            </Button>
            
            <Button 
              type="primary" 
              onClick={handleStartImport}
              loading={loading}
              disabled={sources.length === 0}
            >
              开始导入
            </Button>
          </div>
        </>
      )}
      
      {renderJobStatus()}
      
      {jobStatus && jobStatus.status === 'processing' && (
        <div className="mt-3 text-center">
          <Button type="default" danger onClick={handleCancelImport}>
            取消导入
          </Button>
        </div>
      )}
      
      {error && (
        <div className="mt-3">
          <Text type="danger">{error}</Text>
        </div>
      )}
    </div>
  );
}; 