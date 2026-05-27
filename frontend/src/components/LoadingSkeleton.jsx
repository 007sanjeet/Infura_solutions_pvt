import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-6 animate-pulse shadow-sm flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-2/3">
          <div className="h-5 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="flex items-center space-x-3 pt-2">
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
        <div className="h-6 bg-slate-200 rounded-full w-16"></div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export const TextSkeleton = ({ lines = 4 }) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={`h-4 bg-slate-200 rounded`}
          style={{ width: idx === lines - 1 ? '70%' : '100%' }}
        ></div>
      ))}
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white border border-slate-100 p-6 rounded-lg shadow-sm animate-pulse flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="h-6 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};
