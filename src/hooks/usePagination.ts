import { useState, useMemo, useCallback } from 'react';
import type { UsePaginationParams, UsePaginationReturn } from '@/types/hooks';

/**
 * 分页Hook
 * 
 * @param {Object} params - 参数
 * @param {number} [params.initialPage=1] - 初始页码
 * @param {number} [params.initialPageSize=10] - 初始每页数量
 * @param {number} [params.total=0] - 总数据量
 * @returns {UsePaginationReturn} 分页数据和方法
 * 
 * @example
 * ```tsx
 * const { page, pageSize, totalPages, setPage, nextPage, prevPage } = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 20,
 *   total: 100
 * });
 * ```
 */
const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  total = 0,
}: UsePaginationParams = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);
  
  // 确保页码在有效范围内
  const validatePageNumber = useCallback((pageNumber: number) => {
    return Math.max(1, Math.min(pageNumber, totalPages));
  }, [totalPages]);
  
  // 下一页
  const nextPage = useCallback(() => {
    setPage(prev => validatePageNumber(prev + 1));
  }, [validatePageNumber]);
  
  // 上一页
  const prevPage = useCallback(() => {
    setPage(prev => validatePageNumber(prev - 1));
  }, [validatePageNumber]);
  
  // 跳转到指定页
  const goToPage = useCallback((pageNumber: number) => {
    setPage(validatePageNumber(pageNumber));
  }, [validatePageNumber]);
  
  // 处理页码变化
  const handlePageChange = useCallback((newPage: number) => {
    setPage(validatePageNumber(newPage));
  }, [validatePageNumber]);
  
  // 处理每页数量变化
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    // 调整当前页码，确保数据不会超出范围
    setPage(prev => {
      const newTotalPages = Math.max(1, Math.ceil(total / newPageSize));
      return Math.min(prev, newTotalPages);
    });
  }, [total]);
  
  return {
    page,
    pageSize,
    total,
    totalPages,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    nextPage,
    prevPage,
    goToPage,
  };
};

export default usePagination; 