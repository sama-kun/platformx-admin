'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, Typography, List } from '@mui/material';
import axiosInstance from '@/service/axiosInstance';
import { useRouter } from 'next/navigation';
import { Button as MyButton } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Tooltip as MyTooltip } from '@mui/material';
import toast from 'react-hot-toast';



// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CoursesAnalyticsPage = () => {
    const router = useRouter();
    const { courseId } = useParams();
    const [course, setCourse] = useState<any>({ modules: [], totalParticipants: 0, completedParticipants: 0 });
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [completed, setCompleted] = useState<number>(0);

    const fetchCourse = useCallback( async () => {
        try {
            const { data } = await axiosInstance.get(`/course/${courseId}`, {
                params: {
                    relations: ['modules.taskFlags']
                }
            });
            setCourse({
              title: data.data.title,
              modules: data.data.modules
            });
        } catch (error) {
            console.error('Error fetching course data:', error);
        }
    }, [courseId]);

    const fetchFinishedStudents = useCallback( async() => {
      try {
        const { data } = await axiosInstance.get(`/my-course`, {
            params: {
                relations: ['course', 'createdBy', 'certificate'],
                filter: {
                  course: {
                    id: courseId,
                  },
                  // isFinished: true,
                },
                sort: {
                  isFinished: 'desc'
                }
            }
        });
        const records = data.data.records;

        // Calculate total students
        setTotal(records.length);
        console.log(records.length);

        // Filter to get only completed students
        const completedStudents = records.filter((record: any) => record.isFinished === true);

        // Set the number of completed students
        setCompleted(completedStudents.length);
        console.log(completedStudents.length);
        setMyCourses(records);
    } catch (error) {
        console.error('Error fetching course data:', error);
    }
    }, [courseId])

    useEffect(() => {
        fetchCourse();
        fetchFinishedStudents();
    }, [fetchCourse, fetchFinishedStudents]);

    const chartData = {
        labels: ['Completed', 'In Progress'],
        datasets: [
            {
                label: '# of Students',
                data: [completed, total-completed],
                backgroundColor: ['#4CAF50', '#FFCA28'],
                borderColor: ['#ffffff'],
                borderWidth: 1,
            },
        ],
    };

    const handleCopy = (certificateId: string) => {
      navigator.clipboard.writeText(certificateId)
          .then(() => toast.success('Certificate ID copied!'))
          .catch(err => console.error('Failed to copy text: ', err));
  };

    return (
        <div className="p-6">
            <Typography variant="h4" gutterBottom>
                {course.title} - Course Analytics
            </Typography>
            <Card variant="outlined" style={{ width: '400px', height: '400px' }}>
    <Doughnut data={chartData} />
</Card>

            <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                Modules
            </Typography>
            <List component="nav" aria-label="secondary mailbox folder">
                {/* {course.modules.map((module: any, index: number) => (
                    <React.Fragment key={index}>
                        <ListItem button>
                            <ListItemText primary={module.title} secondary={`Module ${index + 1}`} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))} */}
                <table className="min-w-full border-collapse block md:table py-10">
      <thead className="block md:table-header-group">
        <tr className="bg-black text-white block md:table-row absolute -top-full md:relative md:top-auto">
          <th className="p-3 text-left block md:table-cell">Name</th>
          <th className="p-3 text-left block md:table-cell">Coins</th>
          <th className="p-3 text-left block md:table-cell">Duration</th>
          <th className="p-3 text-left block md:table-cell">Students completed</th>
          <th className="p-3 text-left block md:table-cell"></th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {course.modules.map((value: any, index: number) => (
          <tr key={index} className="bg-gray-200 border border-grey-500 md:border-none block md:table-row">
            <td className="p-3 block md:table-cell">{value.title}</td>
            <td className="p-3 block md:table-cell">
              <span className="bg-red-600 text-white py-1 px-3 rounded-full">0/{value.taskFlags.length}</span>
            </td>
            <td className="p-3 block md:table-cell">24 hours</td>
            <td className="p-3 block md:table-cell">24</td>
            <td className="flex justify-center items-center">
              <MyButton
                className="p-2 border border-gray-300 rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => router.push(`/teacher/module/${value.id}`)}
              >
                Open
              </MyButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
            </List>
            <Typography variant="h6" sx={{ mt: 4, mb: 4 }} gutterBottom>
                Students
            </Typography>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Progress</TableCell>
                        <TableCell align="right">Started</TableCell>
                        <TableCell align="right">Finished</TableCell>
                        <TableCell align="right">Certificate ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {myCourses.map((value: any) => (
                        <TableRow
                            key={value.id}
                    sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        // Conditionally apply background color
                        backgroundColor: value.isFinished ? '#e8f5e9' : '#ffebee', // green for finished, red for not finished
                        color: value.isFinished ? '#2e7d32' : '#d32f2f', // darker green text for finished, darker red text for not finished
                    }}
                        >
                            <TableCell component="th" scope="row">
                                {value.createdBy.name} {value.createdBy.surname}
                            </TableCell>
                            <TableCell align="right">{value.createdBy.email}</TableCell>
                            <TableCell align="right">{value.percent}%</TableCell>
                            <TableCell align="right">
                              {new Date(value.createdAt).toLocaleDateString()} {new Date(value.createdAt).toLocaleTimeString()}
                            </TableCell>
                            <TableCell align="right">
                              {value.isFinished ? (
                                <>
                                {new Date(value.updatedAt).toLocaleDateString()} {new Date(value.updatedAt).toLocaleTimeString()}
                                </>
                              ): (
                                <div>No Data</div>
                              )}
                              
                            </TableCell>

                            <TableCell align="right">
                              {value.isFinished ? (
                                <MyTooltip title="Copy Certificate ID">
                                <Button onClick={() => handleCopy(value.certificate.code || "AY7D23")}>
                                    <FileCopyIcon />

                                    {value.certificate?.code || "AY7D23"}
                                </Button>
                            </MyTooltip>
                              ) : (
                                <div>No data</div>
                              )}
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        </div>
    );
};

export default CoursesAnalyticsPage;
