'use client';

import { useState, useRef, useCallback } from 'react';
import { MaterialType } from '@/types/materials';
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface MaterialUploaderProps {
  onUploadComplete?: (materialId: string, url: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // 单位: 字节
  allowedTypes?: MaterialType[];
  className?: string;
  showPreview?: boolean;
}

const MaterialUploader: React.FC<MaterialUploaderProps> = ({
  onUploadComplete,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.json', '.mp3', '.mp4'],
  maxFileSize = 500 * 1024 * 1024, // 默认500MB
  allowedTypes = Object.values(MaterialType),
  className = '',
  showPreview = true,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [materialType, setMaterialType] = useState<MaterialType>(MaterialType.DOCUMENT);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [materialId, setMaterialId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 文件类型到MaterialType的映射
  const mimeTypeToMaterialType: Record<string, MaterialType> = {
    'application/pdf': MaterialType.PDF,
    'application/msword': MaterialType.DOCUMENT,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': MaterialType.DOCUMENT,
    'text/plain': MaterialType.TEXT,
    'application/json': MaterialType.TEXT,
    'audio/mpeg': MaterialType.AUDIO,
    'audio/mp3': MaterialType.AUDIO,
    'audio/wav': MaterialType.AUDIO,
    'video/mp4': MaterialType.VIDEO,
    'video/mpeg': MaterialType.VIDEO,
    'image/jpeg': MaterialType.IMAGE,
    'image/png': MaterialType.IMAGE,
    'image/gif': MaterialType.IMAGE,
  };
  
  // 根据文件MIME类型猜测MaterialType
  const guessMaterialType = (file: File): MaterialType => {
    return mimeTypeToMaterialType[file.type] || MaterialType.OTHER;
  };
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // 验证文件大小
    if (selectedFile.size > maxFileSize) {
      setUploadError(`文件大小不能超过${Math.floor(maxFileSize / (1024 * 1024))}MB`);
      return;
    }
    
    // 设置文件和初始标题
    setFile(selectedFile);
    setTitle(selectedFile.name.split('.')[0]); // 使用文件名作为默认标题
    setMaterialType(guessMaterialType(selectedFile));
    setUploadError(null);
  };
  
  // 打开文件选择对话框
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  // 上传文件
  const uploadFile = async () => {
    if (!file) {
      setUploadError('请选择要上传的文件');
      return;
    }
    
    if (!title.trim()) {
      setUploadError('请输入材料标题');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      
      // 1. 获取预签名URL
      const presignResponse = await fetch('/api/materials/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          type: materialType,
          metadata: {
            title,
            description,
          },
        }),
      });
      
      if (!presignResponse.ok) {
        const error = await presignResponse.json();
        throw new Error(error.error || '获取上传URL失败');
      }
      
      const { url, materialId, fields, expires } = await presignResponse.json();
      setMaterialId(materialId);
      
      // 2. 使用预签名URL上传文件
      // 在实际应用中，这应该直接上传到存储服务
      // 这里我们模拟上传过程
      
      // 模拟上传进度
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setUploadProgress(Math.min(progress, 95)); // 最高到95%
        
        if (progress >= 95) {
          clearInterval(progressInterval);
        }
      }, 200);
      
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      
      // 3. 完成上传
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // 4. 调用回调
      if (onUploadComplete) {
        onUploadComplete(materialId, url);
      }
    } catch (error) {
      setUploadError((error as Error).message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };
  
  // 重置上传器
  const resetUploader = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
    setMaterialId(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 文件预览
  const renderFilePreview = () => {
    if (!file || !showPreview) return null;
    
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');
    
    if (isImage) {
      return (
        <div className="mt-4 max-w-xs mx-auto">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name} 
            className="max-h-40 object-contain rounded" 
          />
        </div>
      );
    }
    
    if (isAudio) {
      return (
        <div className="mt-4 max-w-xs mx-auto">
          <audio controls className="w-full">
            <source src={URL.createObjectURL(file)} type={file.type} />
            您的浏览器不支持音频播放
          </audio>
        </div>
      );
    }
    
    if (isVideo) {
      return (
        <div className="mt-4 max-w-xs mx-auto">
          <video controls className="max-h-40 object-contain rounded w-full">
            <source src={URL.createObjectURL(file)} type={file.type} />
            您的浏览器不支持视频播放
          </video>
        </div>
      );
    }
    
    return (
      <div className="mt-4 text-center">
        <FiFile className="mx-auto text-4xl text-gray-500" />
        <p className="text-sm text-gray-500 mt-1 truncate max-w-xs mx-auto">{file.name}</p>
        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
      </div>
    );
  };
  
  // 渲染上传进度
  const renderUploadProgress = () => {
    if (!uploading && !uploadSuccess) return null;
    
    return (
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${uploadSuccess ? 'bg-green-500' : 'bg-blue-500'}`} 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1 text-center">
          {uploadSuccess ? '上传完成' : `上传中... ${uploadProgress}%`}
        </p>
      </div>
    );
  };
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-lg font-medium mb-4">上传学习材料</h3>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(',')}
      />
      
      {!file ? (
        <div
          onClick={openFileDialog}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <FiUpload className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-gray-600">点击或拖拽文件到这里上传</p>
          <p className="text-sm text-gray-400 mt-1">
            支持的文件类型: {acceptedFileTypes.join(', ')}
          </p>
          <p className="text-sm text-gray-400">
            最大文件大小: {Math.floor(maxFileSize / (1024 * 1024))}MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {renderFilePreview()}
          
          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                材料类型
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              >
                {allowedTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'document' ? '文档' : 
                     type === 'video' ? '视频' : 
                     type === 'audio' ? '音频' : 
                     type === 'image' ? '图片' : 
                     type === 'pdf' ? 'PDF' : 
                     type === 'text' ? '文本' : 
                     type === 'subtitle' ? '字幕' : '其他'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                材料标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入材料标题"
                disabled={uploading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                材料描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入材料描述（可选）"
                rows={3}
                disabled={uploading}
              />
            </div>
          </div>
          
          {renderUploadProgress()}
          
          {uploadError && (
            <div className="text-red-500 text-sm mt-2 flex items-center">
              <FiAlertCircle className="mr-1" />
              {uploadError}
            </div>
          )}
          
          {uploadSuccess ? (
            <div className="flex items-center justify-center mt-4 text-green-500">
              <FiCheckCircle className="mr-1" />
              上传成功！
            </div>
          ) : (
            <div className="flex space-x-3 mt-4">
              <button
                type="button"
                onClick={resetUploader}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              >
                取消
              </button>
              <button
                type="button"
                onClick={uploadFile}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading || !file || !title.trim()}
              >
                {uploading ? '上传中...' : '上传文件'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialUploader; 