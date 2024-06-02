import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AddButton from '@/components/ui/AddButton';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/service/axiosInstance';

// import { Home, Info, ContactMail, Dashboard } from '@mui/icons-material';
// import { IconButton, Tooltip } from '@mui/material';

const Navbar = () => {
  const {id, flagId, subjectId} = useParams();
  const router = useRouter();
  const [moduler, setModule] = useState<any>({});
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const isActive = !flagId && !subjectId;
  const fetchModule = async () => {
    const moduleRes = await axiosInstance.get(`/module/${id}`, {
      params: {
          relations: ['course', 'taskFlags', 'subjects'],
          filter: {
              course: {
                  id
              }
          }
      }
  });
  if(moduleRes.status < 300) {
      setModule(moduleRes.data.data)
      setTasks(moduleRes.data.data.taskFlags)
      setSubjects(moduleRes.data.data.subjects)
  }
  } 

  useEffect(() => {
    fetchModule()
  }, [id])
  return (
    <div className="flex flex-col w-64 h-screen text-black fixed overflow-y-auto">
      <div className="flex items-center justify-center h-20">
        <span className="text-xl font-bold text-center">{moduler.title}</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-4">
          <Link 
            href={`/teacher/module/${id}`} 
            className={`flex items-center space-x-3 p-2 ${isActive ? 'bg-black text-white' : 'hover:bg-gray-200'} rounded-md`}
          >
            <span>About Module</span>
          </Link>
          <span className="text-xl font-bold">Subjects</span>
          {subjects.map((value, index) => (
            <Link 
              key={index} 
              href={`/teacher/module/${id}/subject/${value.id}`} 
              className={`flex items-center space-x-3 p-2 rounded-md ${subjectId == value.id ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            >
              <span>{value.title}</span>
            </Link>
          ))}
        </nav>
        <AddButton onClick={() => router.push(`/teacher/module/${id}/subject/create`)} />
        <nav className="flex flex-col p-4 space-y-4">
          <span className="text-xl font-bold">Tasks</span>
          {tasks.map((value, index) => (
            <Link 
              key={index} 
              href={`/teacher/module/${id}/task/flag/${value.id}`} 
              className={`flex items-center space-x-3 p-2 rounded-md ${flagId == value.id ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            >
              <span>{value.title}</span>
            </Link>
          ))}
        </nav>
        <AddButton onClick={() => router.push(`/teacher/module/${id}/task/flag/create`)} />
      </div>
    </div>

  );
};

export default Navbar;
