import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ModuleTable = ({ modules }: { modules: any[] }) => {
  const router = useRouter();

  return (
    <table className="min-w-full border-collapse block md:table py-10">
      <thead className="block md:table-header-group">
        <tr className="bg-black text-white block md:table-row absolute -top-full md:relative md:top-auto">
          <th className="p-3 text-left block md:table-cell">Name</th>
          <th className="p-3 text-left block md:table-cell">Coins</th>
          <th className="p-3 text-left block md:table-cell">Duration</th>
          <th className="p-3 text-left block md:table-cell"></th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {modules.map((value, index) => (
          <tr key={index} className="bg-gray-200 border border-grey-500 md:border-none block md:table-row">
            <td className="p-3 block md:table-cell">{value.title}</td>
            <td className="p-3 block md:table-cell">
              <span className="bg-red-600 text-white py-1 px-3 rounded-full">0/{value.taskFlags.length}</span>
            </td>
            <td className="p-3 block md:table-cell">24 hours</td>
            <td className="flex justify-center items-center">
              <Button
                className="p-2 border border-gray-300 rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => router.push(`/teacher/module/${value.id}`)}
              >
                Open
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ModuleTable;
