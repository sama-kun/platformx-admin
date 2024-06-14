'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Card from "@/app/(dashboard)/_components/card";
import { useEffect, useState } from "react";

import axiosInstance from "@/service/axiosInstance";

const CoursesPage = () => {
    
    const [courses, setCourses] = useState<any[]>([]);

    const fetchCourses = async() => {
      const courses = await axiosInstance.get('/course');
      setCourses(courses.data.data.records);
    }
    useEffect(() => {
      fetchCourses();
    }, [])
    return ( 
        <div className="p-6">
            <Link href="/teacher/create">
                <Button>
                    New Course
                </Button>
            </Link>

            <div className="p-6">
            {courses.map((course, index) => (
                <Card
                key={index}
                title={course.title}
                imageUrl={course.image}
                link={course.link}
                id={course.id}
                />
            ))}
            </div>
        </div>
     );
}
 
export default CoursesPage;