"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import toast from "react-hot-toast";
import Link from "next/link";
import JoditEditorUI from '../../../../../../components/ui/joditEditor';

import {
    Form,
    FormControl,
    FormDescription,
    FormLabel,
    FormField,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModuleTable from "@/app/(dashboard)/_components/ModuleTable";
import axiosInstance from "@/service/axiosInstance";
import { useCallback, useEffect, useState } from "react";
import ButtonLayout from "@/components/ButtonLayout";
import ImageUpload from "@/app/(dashboard)/_components/ImageUpload";

interface CourseFormValues {
  title: string;
  description: string;
  key: string;
  vm: string;
}

const DetailPage = () => {
    const formSchema = z.object({
        title: z.string().min(1, {
            message: "Title is required",
        }),
        description: z.string().min(1, {
            message: "Description is required",
        }),
        key: z.string(),
        vm: z.string(),
    });
    const router = useRouter();
    const { id } = useParams();
    const [course, setCourse] = useState<any>({});
    const [modules, setModules] = useState<any[]>([]);
    const form = useForm<CourseFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            key: "",
            vm: "",
        },
    });

    const fetchCourseAndModules = useCallback(async () => {
        const courseRes = await axiosInstance.get('/course/' + id, {
          params: {
            relations: ['myCourses']
          }
        });
    
        console.log(courseRes.data.data);
    
        if (courseRes.status === 200) {
          setCourse(courseRes.data.data);
          form.reset({
            title: courseRes.data.data.title,
            description: courseRes.data.data.description,
            key: courseRes.data.data.key,
            vm: courseRes.data.data.vm,
          });
          const moduleRes = await axiosInstance.get('/module', {
            params: {
              relations: ['course', 'taskFlags'],
              filter: {
                course: {
                  id
                }
              }
            }
          });
          console.log(moduleRes.data.data.records);
          if (moduleRes.status === 200) {
            setModules(moduleRes.data.data.records);
          }
        }
      }, [form, id]);

    useEffect(() => {
        fetchCourseAndModules();
    }, [fetchCourseAndModules])

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: CourseFormValues) => {
        try {
            const response = await axiosInstance.patch("/course/"+id, values);
            if (response.status < 300) {
                toast.success("Course was successfully updated");
            }
            console.log(values);
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <ButtonLayout>
        <div>
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your course</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don not worry, you can change it later.
                </p>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField 
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course title</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Cybersecurity'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>What will you teach in this course?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course description</FormLabel>
                                    <FormControl>
                                    <JoditEditorUI<CourseFormValues>
                          disabled={isSubmitting}
                          name="description"
                          control={form.control}
                        />
                                    </FormControl>
                                    <FormDescription>Describe the content of your course.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VM Key</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Cybersecurity VM'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Name of VM</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="vm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel></FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'https://drive.google.com/file/d/11UbQqSfmAYztgVg/view?usp=drive_link'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>URL to your VM</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="button" variant="ghost" onClick={() => fetchCourseAndModules()}>Reset</Button>
                            <Button 
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </Form>
                <ImageUpload courseId={id} initialImage={course.image}/>
                <div className="py-10">

                  <div className="py-5">
                  <h1 className="text-2xl py-5">Modules</h1>
                    <Button onClick={() => router.push('/teacher/module/create/'+id)}>
                      Add new module
                    </Button>
                  </div>
                  <ModuleTable modules={modules}/>
                </div>
            </div>
        </div>
        </div>
        </ButtonLayout>
    );
}

export default DetailPage;
