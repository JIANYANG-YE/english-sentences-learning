'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiUpload, 
  FiPackage, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiArrowRight
} from 'react-icons/fi';

/**
 * 系统状态卡片组件
 */
interface StatusCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatusCard = ({ title, value, description, icon, color }: StatusCardProps) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

/**
 * 快捷操作卡片组件
 */
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const ActionCard = ({ title, description, icon, href, color }: ActionCardProps) => (
  <Link href={href} className="block">
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-full ${color} inline-block mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>
      <div className="flex items-center text-blue-600 font-medium">
        <span>开始操作</span>
        <FiArrowRight className="ml-2" />
      </div>
    </div>
  </Link>
);

/**
 * 管理后台首页
 */
export default function AdminDashboard() {
  const [recentImports, setRecentImports] = useState([
    { id: 'imp-1', name: '商务英语对话集', date: '2023-08-15', status: 'completed', count: 42 },
    { id: 'imp-2', name: '旅游场景英语', date: '2023-08-14', status: 'completed', count: 28 },
    { id: 'imp-3', name: '科技新闻英语集', date: '2023-08-12', status: 'failed', count: 0 },
    { id: 'imp-4', name: '日常英语口语', date: '2023-08-10', status: 'completed', count: 36 },
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    { id: 'alert-1', type: 'warning', message: '有3个内容质量得分低于70分，建议检查', time: '2小时前' },
    { id: 'alert-2', type: 'info', message: '批量导入任务已完成：日常英语口语', time: '1天前' },
    { id: 'alert-3', type: 'success', message: '系统更新已完成，版本 2.3.0', time: '2天前' },
  ]);
  
  // 获取仪表板数据
  useEffect(() => {
    // 在实际应用中，这里应该调用API获取仪表板数据
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">系统仪表板</h1>
        <p className="text-gray-600 mt-2">系统概览和快捷操作入口</p>
      </div>
      
      {/* 系统状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard 
          title="总课程内容数" 
          value="487" 
          description="较上月增长 12%" 
          icon={<FiPackage className="text-white" size={20} />} 
          color="bg-blue-500"
        />
        <StatusCard 
          title="用户总数" 
          value="1,238" 
          description="较上月增长 5%" 
          icon={<FiUsers className="text-white" size={20} />} 
          color="bg-green-500"
        />
        <StatusCard 
          title="本月导入量" 
          value="126" 
          description="较上月增长 8%" 
          icon={<FiUpload className="text-white" size={20} />} 
          color="bg-purple-500"
        />
        <StatusCard 
          title="平均内容质量" 
          value="87.4" 
          description="较上月提升 2.3 分" 
          icon={<FiBarChart2 className="text-white" size={20} />} 
          color="bg-orange-500"
        />
      </div>
      
      {/* 快捷操作卡片 */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">快捷操作</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActionCard 
          title="导入新内容" 
          description="导入文件、URL或直接输入内容，支持批量处理" 
          icon={<FiUpload className="text-white" size={20} />} 
          href="/admin/content-management" 
          color="bg-blue-500"
        />
        <ActionCard 
          title="内容质量分析" 
          description="检测内容质量，提供改进建议" 
          icon={<FiBarChart2 className="text-white" size={20} />} 
          href="/admin/content-management?tab=analytics" 
          color="bg-green-500"
        />
        <ActionCard 
          title="系统设置" 
          description="配置系统参数，管理资源和权限" 
          icon={<FiSettings className="text-white" size={20} />} 
          href="/admin/settings" 
          color="bg-purple-500"
        />
      </div>
      
      {/* 最近导入记录和系统提醒 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近导入记录 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">最近导入记录</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内容名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    导入日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内容数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentImports.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'completed' ? '成功' : '失败'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 系统提醒 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">系统提醒</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ul className="divide-y divide-gray-200">
              {systemAlerts.map((alert) => (
                <li key={alert.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {alert.type === 'warning' && (
                        <FiAlertTriangle className="text-yellow-500" size={18} />
                      )}
                      {alert.type === 'info' && (
                        <FiClock className="text-blue-500" size={18} />
                      )}
                      {alert.type === 'success' && (
                        <FiCheckCircle className="text-green-500" size={18} />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 