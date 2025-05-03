'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MaterialUploader from '@/components/materials/MaterialUploader';
import MaterialProcessor from '@/components/materials/MaterialProcessor';
import { MaterialType } from '@/types/materials';
import { FiUpload, FiChevronRight, FiPackage, FiCheck, FiBook } from 'react-icons/fi';

export default function MaterialUploadPage() {
  const router = useRouter();
  const [uploadedMaterialId, setUploadedMaterialId] = useState<string | null>(null);
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [materialType, setMaterialType] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'process' | 'complete'>('upload');
  const [courseId, setCourseId] = useState<string | null>(null);
  
  // 处理上传完成
  const handleUploadComplete = (materialId: string, url: string, title?: string, type?: string) => {
    setUploadedMaterialId(materialId);
    setMaterialTitle(title || '');
    setMaterialType(type || '文档');
    setStep('process');
  };
  
  // 处理处理完成
  const handleProcessComplete = (newCourseId: string) => {
    setCourseId(newCourseId);
    setStep('complete');
  };
  
  // 查看创建的课程
  const viewCourse = () => {
    if (courseId) {
      router.push(`/courses/${courseId}`);
    }
  };
  
  // 上传新材料
  const uploadNewMaterial = () => {
    setUploadedMaterialId(null);
    setMaterialTitle('');
    setMaterialType('');
    setCourseId(null);
    setStep('upload');
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiUpload className="mr-2" />
        上传学习材料
      </h1>
      
      {/* 步骤导航 */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex flex-col items-center ${step === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 'upload' ? 'bg-blue-100 text-blue-600' : (
              step === 'process' || step === 'complete' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
            )
          }`}>
            {step === 'upload' ? <FiUpload /> : <FiCheck />}
          </div>
          <span className="text-sm mt-2">上传材料</span>
        </div>
        
        <div className="w-16 h-1 mx-2 bg-gray-200">
          <div className={`h-full ${step === 'upload' ? 'w-0' : 'w-full bg-green-500'}`}></div>
        </div>
        
        <div className={`flex flex-col items-center ${step === 'process' ? 'text-blue-600' : (step === 'complete' ? 'text-green-500' : 'text-gray-500')}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 'process' ? 'bg-blue-100 text-blue-600' : (
              step === 'complete' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
            )
          }`}>
            {step === 'complete' ? <FiCheck /> : <FiPackage />}
          </div>
          <span className="text-sm mt-2">处理内容</span>
        </div>
        
        <div className="w-16 h-1 mx-2 bg-gray-200">
          <div className={`h-full ${step === 'complete' ? 'w-full bg-green-500' : 'w-0'}`}></div>
        </div>
        
        <div className={`flex flex-col items-center ${step === 'complete' ? 'text-green-500' : 'text-gray-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step === 'complete' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
          }`}>
            {step === 'complete' ? <FiCheck /> : <FiBook />}
          </div>
          <span className="text-sm mt-2">创建课程</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {step === 'upload' && (
          <MaterialUploader 
            onUploadComplete={(materialId, url) => handleUploadComplete(
              materialId, 
              url, 
              document.querySelector<HTMLInputElement>('input[type="text"]')?.value || '',
              document.querySelector<HTMLSelectElement>('select')?.value || '文档'
            )}
          />
        )}
        
        {step === 'process' && uploadedMaterialId && (
          <MaterialProcessor 
            materialId={uploadedMaterialId}
            title={materialTitle}
            type={materialType}
            onProcessComplete={handleProcessComplete}
          />
        )}
        
        {step === 'complete' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">课程创建成功！</h2>
            <p className="text-gray-600 mb-6">
              您的学习材料已成功处理并转换为课程内容。
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={uploadNewMaterial}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                上传新材料
              </button>
              <button
                onClick={viewCourse}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                查看课程
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">支持的材料格式</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">文档</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>PDF文档 (.pdf)</li>
              <li>Word文档 (.doc, .docx)</li>
              <li>文本文件 (.txt)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">多媒体</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>音频文件 (.mp3, .wav)</li>
              <li>视频文件 (.mp4)</li>
              <li>字幕文件 (.srt, .vtt)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-medium mb-2">其他</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>JSON数据 (.json)</li>
              <li>图像文件 (.jpg, .png)</li>
              <li>网页文档 (.html)</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          上传后，我们的系统将自动处理内容，提取文本，对齐句子，并创建结构化的课程。
          处理速度取决于材料的大小和复杂度。
        </p>
      </div>
    </div>
  );
} 