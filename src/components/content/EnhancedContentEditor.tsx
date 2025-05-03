/**
 * 高级内容编辑器组件
 * 提供内容分析、优化和结构化处理功能
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Select, 
  Space, 
  Tabs, 
  Tag, 
  Tooltip, 
  Drawer,
  Collapse,
  notification,
  Spin,
  Divider,
  Row,
  Col,
  Progress,
  Radio,
  Form,
  Checkbox,
  List,
  Statistic,
  Typography
} from 'antd';
import { 
  FileTextOutlined, 
  EditOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  SplitCellsOutlined,
  TranslationOutlined,
  RiseOutlined,
  DownloadOutlined,
  TagOutlined
} from '@ant-design/icons';
import { ContentFormat } from '@/types/courses/packageTypes';
import intelligentContentService, { 
  ContentAnalysisResult, 
  ContentOptimizationOptions,
  ContentKeyword,
  ContentBlock
} from '@/services/intelligentContentService';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

interface EnhancedContentEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onAnalysisComplete?: (analysis: ContentAnalysisResult) => void;
  showToolbar?: boolean;
  height?: number | string;
  autoAnalyze?: boolean;
}

const EnhancedContentEditor: React.FC<EnhancedContentEditorProps> = ({
  initialContent = '',
  onContentChange,
  onAnalysisComplete,
  showToolbar = true,
  height = 500,
  autoAnalyze = false
}) => {
  // 内容状态
  const [content, setContent] = useState(initialContent);
  const [analyzedContent, setAnalyzedContent] = useState<ContentAnalysisResult | null>(null);
  const [keywords, setKeywords] = useState<ContentKeyword[]>([]);
  const [structuredContent, setStructuredContent] = useState<ContentBlock[]>([]);
  const [optimizedContent, setOptimizedContent] = useState('');
  
  // UI状态
  const [activeTab, setActiveTab] = useState('editor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isStructuring, setIsStructuring] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showAnalysisDrawer, setShowAnalysisDrawer] = useState(false);
  const [showOptimizationDrawer, setShowOptimizationDrawer] = useState(false);
  
  // 优化选项
  const [optimizationOptions, setOptimizationOptions] = useState<ContentOptimizationOptions>({
    targetDifficulty: 'intermediate',
    simplifyLanguage: false,
    enhanceVocabulary: true,
    adjustLength: 'none',
    focusAreas: [],
    preserveKeyElements: true
  });
  
  // 格式转换选项
  const [formatOptions, setFormatOptions] = useState({
    fromFormat: 'text' as ContentFormat,
    toFormat: 'markdown' as ContentFormat
  });
  
  // 引用编辑器
  const editorRef = useRef<any>(null);
  
  // 初始化时，如果设置了自动分析，则执行内容分析
  useEffect(() => {
    if (initialContent && autoAnalyze) {
      handleAnalyzeContent();
    }
  }, [initialContent, autoAnalyze]);
  
  // 当内容变化时通知父组件
  useEffect(() => {
    if (onContentChange) {
      onContentChange(content);
    }
  }, [content, onContentChange]);
  
  // 当分析完成时通知父组件
  useEffect(() => {
    if (onAnalysisComplete) {
      onAnalysisComplete(analyzedContent);
    }
  }, [analyzedContent, onAnalysisComplete]);
  
  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  // 分析内容
  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      notification.warning({
        message: '无法分析',
        description: '请先输入一些内容'
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await intelligentContentService.analyzeContent(content);
      setAnalyzedContent(result);
      setShowAnalysisDrawer(true);
    } catch (error) {
      notification.error({
        message: '分析失败',
        description: `分析内容时发生错误: ${(error as Error).message}`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // 优化内容
  const handleOptimizeContent = async () => {
    if (!content.trim()) {
      notification.warning({
        message: '无法优化',
        description: '请先输入一些内容'
      });
      return;
    }
    
    setIsOptimizing(true);
    try {
      const result = await intelligentContentService.optimizeContent(content, optimizationOptions);
      setOptimizedContent(result.enhancedContent);
      setActiveTab('optimized');
      notification.success({
        message: '内容已优化',
        description: '内容已成功优化，可以在"优化结果"标签中查看结果'
      });
    } catch (error) {
      notification.error({
        message: '优化失败',
        description: `优化内容时发生错误: ${(error as Error).message}`
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // 结构化内容
  const handleStructureContent = async () => {
    if (!content.trim()) {
      notification.warning({
        message: '无法结构化',
        description: '请先输入一些内容'
      });
      return;
    }
    
    setIsStructuring(true);
    try {
      const blocks = await intelligentContentService.structureContent(content);
      setStructuredContent(blocks);
      notification.success({
        message: '内容已结构化',
        description: '内容已成功转换为结构化格式，可以在"结构"标签中查看结果'
      });
    } catch (error) {
      notification.error({
        message: '结构化失败',
        description: `结构化内容时发生错误: ${(error as Error).message}`
      });
    } finally {
      setIsStructuring(false);
    }
  };
  
  // 提取关键词
  const handleExtractKeywords = async () => {
    if (!content.trim()) {
      notification.warning({
        message: '无法提取关键词',
        description: '请先输入一些内容'
      });
      return;
    }
    
    setIsExtracting(true);
    try {
      const extractedKeywords = await intelligentContentService.extractKeywords(content);
      setKeywords(extractedKeywords);
      notification.success({
        message: '关键词提取成功',
        description: `已提取 ${extractedKeywords.length} 个关键词`
      });
    } catch (error) {
      notification.error({
        message: '提取关键词失败',
        description: `提取关键词时发生错误: ${(error as Error).message}`
      });
    } finally {
      setIsExtracting(false);
    }
  };
  
  // 转换格式
  const handleConvertFormat = async () => {
    if (!content.trim()) {
      notification.warning({
        message: '无法转换格式',
        description: '请先输入一些内容'
      });
      return;
    }
    
    try {
      const converted = await intelligentContentService.convertFormat(
        content,
        formatOptions.fromFormat,
        formatOptions.toFormat
      );
      setOptimizedContent(converted);
      setActiveTab('optimized');
      notification.success({
        message: '格式转换成功',
        description: `已将内容从 ${formatOptions.fromFormat} 转换为 ${formatOptions.toFormat} 格式`
      });
    } catch (error) {
      notification.error({
        message: '格式转换失败',
        description: `转换格式时发生错误: ${(error as Error).message}`
      });
    }
  };
  
  // 应用优化内容
  const handleApplyEnhanced = () => {
    setContent(optimizedContent);
    notification.success({
      message: '已应用优化内容',
      description: '优化后的内容已应用到编辑器'
    });
  };
  
  // 渲染分析结果抽屉
  const renderAnalysisDrawer = () => {
    if (!analyzedContent) return null;
    
    return (
      <Drawer
        title="内容分析结果"
        placement="right"
        onClose={() => setShowAnalysisDrawer(false)}
        visible={showAnalysisDrawer}
        width={500}
      >
        <Spin spinning={isAnalyzing}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="内容难度">
              <Space>
                <Tag color={
                  analyzedContent.difficulty === 'beginner' ? 'green' :
                  analyzedContent.difficulty === 'intermediate' ? 'blue' : 'red'
                }>
                  {analyzedContent.difficulty === 'beginner' ? '初级' :
                   analyzedContent.difficulty === 'intermediate' ? '中级' : '高级'}
                </Tag>
                {analyzedContent.difficulty === 'beginner' && <span>适合初学者</span>}
                {analyzedContent.difficulty === 'intermediate' && <span>适合中级学习者</span>}
                {analyzedContent.difficulty === 'advanced' && <span>适合高级学习者</span>}
              </Space>
            </Card>
            
            <Card title="内容结构">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic 
                    title="段落数" 
                    value={analyzedContent.contentStructure.paragraphCount} 
                    suffix="段"
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="句子数" 
                    value={analyzedContent.contentStructure.sentenceCount} 
                    suffix="句"
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="平均句长" 
                    value={analyzedContent.contentStructure.averageSentenceLength.toFixed(1)} 
                    suffix="词/句"
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="对话数" 
                    value={analyzedContent.contentStructure.dialogueCount} 
                    suffix="段"
                  />
                </Col>
              </Row>
            </Card>
            
            <Card title="主题标签">
              <Space wrap>
                {analyzedContent.topicTags.map((tag: string, index: number) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>
            </Card>
            
            <Card title="关键词汇">
              <List
                size="small"
                dataSource={analyzedContent.keyVocabulary.slice(0, 10)}
                renderItem={(item: any) => (
                  <List.Item>
                    <Space>
                      <span>{item.word}</span>
                      <Tag color="green">{item.translation}</Tag>
                      <span>出现频率: {item.frequency}</span>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
            
            <Card title="语法点">
              <Space wrap>
                {analyzedContent.grammarPoints.map((point: string, index: number) => (
                  <Tag key={index} color="purple">{point}</Tag>
                ))}
              </Space>
            </Card>
            
            <Button 
              type="primary" 
              onClick={() => setShowOptimizationDrawer(true)}
              style={{ marginTop: 16 }}
            >
              基于分析优化内容
            </Button>
          </Space>
        </Spin>
      </Drawer>
    );
  };
  
  // 渲染优化选项抽屉
  const renderOptimizationDrawer = () => {
    return (
      <Drawer
        title="内容优化选项"
        placement="right"
        onClose={() => setShowOptimizationDrawer(false)}
        visible={showOptimizationDrawer}
        width={500}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form layout="vertical">
            <Form.Item label="目标难度级别">
              <Select
                value={optimizationOptions.targetDifficulty}
                onChange={(value) => setOptimizationOptions({
                  ...optimizationOptions,
                  targetDifficulty: value
                })}
              >
                <Option value="beginner">初级</Option>
                <Option value="intermediate">中级</Option>
                <Option value="advanced">高级</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="语言处理">
              <Checkbox
                checked={optimizationOptions.simplifyLanguage}
                onChange={(e) => setOptimizationOptions({
                  ...optimizationOptions,
                  simplifyLanguage: e.target.checked
                })}
              >
                简化语言(使用更简单的词汇和句式)
              </Checkbox>
              <Checkbox
                checked={optimizationOptions.enhanceVocabulary}
                onChange={(e) => setOptimizationOptions({
                  ...optimizationOptions,
                  enhanceVocabulary: e.target.checked
                })}
              >
                增强词汇(加入更多相关词汇和表达)
              </Checkbox>
            </Form.Item>
            
            <Form.Item label="内容长度调整">
              <Radio.Group
                value={optimizationOptions.adjustLength}
                onChange={(e) => setOptimizationOptions({
                  ...optimizationOptions,
                  adjustLength: e.target.value
                })}
              >
                <Radio value="shorten">缩短内容</Radio>
                <Radio value="expand">扩展内容</Radio>
                <Radio value="none">保持原长度</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item label="重点关注领域">
              <Select
                mode="multiple"
                value={optimizationOptions.focusAreas}
                onChange={(value) => setOptimizationOptions({
                  ...optimizationOptions,
                  focusAreas: value
                })}
                style={{ width: '100%' }}
              >
                <Option value="vocabulary">词汇</Option>
                <Option value="grammar">语法</Option>
                <Option value="expressions">表达方式</Option>
                <Option value="culture">文化背景</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Checkbox
                checked={optimizationOptions.preserveKeyElements}
                onChange={(e) => setOptimizationOptions({
                  ...optimizationOptions,
                  preserveKeyElements: e.target.checked
                })}
              >
                保留原文关键要素(关键词、专有名词等)
              </Checkbox>
            </Form.Item>
            
            <Button 
              type="primary" 
              onClick={handleOptimizeContent}
              loading={isOptimizing}
              block
            >
              应用优化选项
            </Button>
          </Form>
        </Space>
      </Drawer>
    );
  };
  
  // 渲染格式转换面板
  const renderFormatConversionPanel = () => {
    return (
      <Collapse>
        <Panel header="格式转换" key="format">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form layout="inline">
              <Form.Item label="源格式">
                <Select
                  value={formatOptions.fromFormat}
                  onChange={(value) => setFormatOptions({
                    ...formatOptions,
                    fromFormat: value
                  })}
                  style={{ width: 120 }}
                >
                  <Option value="text">纯文本</Option>
                  <Option value="html">HTML</Option>
                  <Option value="markdown">Markdown</Option>
                  <Option value="json">JSON</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="目标格式">
                <Select
                  value={formatOptions.toFormat}
                  onChange={(value) => setFormatOptions({
                    ...formatOptions,
                    toFormat: value
                  })}
                  style={{ width: 120 }}
                >
                  <Option value="text">纯文本</Option>
                  <Option value="html">HTML</Option>
                  <Option value="markdown">Markdown</Option>
                  <Option value="json">JSON</Option>
                </Select>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={handleConvertFormat}
                >
                  转换
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Panel>
      </Collapse>
    );
  };
  
  return (
    <Card className="enhanced-content-editor">
      {showToolbar && (
        <div className="editor-toolbar">
          <Space wrap>
            <Button 
              icon={<BarChartOutlined />} 
              onClick={handleAnalyzeContent}
              loading={isAnalyzing}
            >
              分析内容
            </Button>
            <Button 
              icon={<RiseOutlined />} 
              onClick={() => setShowOptimizationDrawer(true)}
            >
              优化内容
            </Button>
            <Button 
              icon={<SplitCellsOutlined />} 
              onClick={handleStructureContent}
              loading={isStructuring}
            >
              结构化内容
            </Button>
            <Button 
              icon={<InfoCircleOutlined />} 
              onClick={handleExtractKeywords}
              loading={isExtracting}
            >
              提取关键词
            </Button>
            <Tooltip title="格式转换选项">
              <Button 
                icon={<SettingOutlined />}
                onClick={() => {
                  // 切换格式转换面板
                }}
              />
            </Tooltip>
          </Space>
          
          {renderFormatConversionPanel()}
        </div>
      )}
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <EditOutlined />
              编辑器
            </span>
          } 
          key="editor"
        >
          <TextArea
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            placeholder="在此输入内容..."
            style={{ width: '100%', height }}
            autoSize={false}
          />
          
          {keywords.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Divider orientation="left">关键词</Divider>
              <Space wrap>
                {keywords.map((keyword, index) => (
                  <Tooltip 
                    key={index} 
                    title={keyword.translation ? `${keyword.translation} (相关度: ${keyword.relevance.toFixed(2)})` : `相关度: ${keyword.relevance.toFixed(2)}`}
                  >
                    <Tag color="blue">{keyword.keyword}</Tag>
                  </Tooltip>
                ))}
              </Space>
            </div>
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              分析
            </span>
          } 
          key="analysis"
        >
          {renderAnalysisDrawer()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <EditOutlined />
              优化
            </span>
          } 
          key="optimize"
        >
          {renderOptimizationDrawer()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <EditOutlined />
              优化结果
            </span>
          } 
          key="optimized"
          disabled={!optimizedContent}
        >
          <TextArea
            value={optimizedContent}
            style={{ width: '100%', height: height - 50 }}
            readOnly
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button 
              type="primary" 
              onClick={handleApplyEnhanced}
            >
              应用此优化
            </Button>
            <Button 
              style={{ marginLeft: 8 }}
              icon={<DownloadOutlined />}
              onClick={() => {
                // 下载优化后的内容
                const blob = new Blob([optimizedContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'optimized-content.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              下载
            </Button>
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <TagOutlined />
              关键词
            </span>
          } 
          key="keywords"
          disabled={keywords.length === 0}
        >
          <div style={{ height, overflow: 'auto' }}>
            {keywords.map((keyword, index) => (
              <Card 
                key={index} 
                style={{ marginBottom: 16 }}
              >
                <Space>
                  <Tag color="blue">{keyword.keyword}</Tag>
                  {keyword.translation && <Tag color="green">{keyword.translation}</Tag>}
                </Space>
              </Card>
            ))}
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <SplitCellsOutlined />
              结构
            </span>
          } 
          key="structure"
          disabled={structuredContent.length === 0}
        >
          <div style={{ height, overflow: 'auto' }}>
            {structuredContent.map((block, index) => (
              <Card 
                key={index} 
                style={{ marginBottom: 16 }}
                title={`块 #${index + 1} - ${block.type}`}
              >
                <p>{block.content}</p>
                {block.translations && (
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">翻译</Tag>
                    <p>{block.translations[0]}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default EnhancedContentEditor; 