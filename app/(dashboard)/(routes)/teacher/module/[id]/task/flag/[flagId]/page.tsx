"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteIcon from '@mui/icons-material/Delete';
import JoditEditorUI from '../../../../../../../../../components/ui/joditEditor';

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
import ModuleLayout from "../../../../layout";
import axiosInstance from "@/service/axiosInstance";
import { useEffect, useCallback } from 'react';
import FileInput from "@/app/(dashboard)/_components/fileInput";
import ButtonLayout from "@/components/ButtonLayout";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
    flag: z.string().optional()
});

const TaskFlagDetailPage = () => {
    const {flagId, id} = useParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            flag: "",
        },
    });

    const fetchFlagTask = useCallback(async () => {
        const response = await axiosInstance.get('/task-flag/'+flagId);
        console.log(response.data);
        form.reset({
            title: response.data.data.title,
            description: response.data.data.description,
            // flag: response.data.data.flag,
        });
    }, [form, flagId])

    const onDelete = async() => {
        const response = await axiosInstance.delete('/task-flag/'+flagId);
        if(response.status < 300) {
            toast.success('Was deleted!!!')
            router.push('/teacher/module'+id);
        }
        console.log(response.data);
    }

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Создаем новый объект, исключая пустое поле flag
            const payload = {
                title: values.title,
                description: values.description,
                ...(values.flag && { flag: values.flag }),
            };
            console.log(payload);
            const response = await axiosInstance.patch('/task-flag/'+flagId, payload);
            if(response.status < 300) {
                toast.success("Task Flag successfully updated");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchFlagTask();
    }, [fetchFlagTask]);

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your Task Flag</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your Task Flag? Don not worry, you can change it later.
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
                                    <FormLabel>Subject title</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Cybersecurity'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>What will you teach in this Task Flag?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject description</FormLabel>
                                    <FormControl>
                                        <JoditEditorUI 
                                            disabled={isSubmitting}
                                            name="description"
                                            control={form.control}
                                        />
                                    </FormControl>
                                    <FormDescription>Describe the content of your Task Flag.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="flag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Flag of answer</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'f3894af4f1ffa42b3a379dddba384405'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>What is true answer of Task Flag?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="button" variant="ghost" onClick={() => fetchFlagTask()}>Cancel</Button>
                            <Button 
                                type="submit"
                                // disabled={!isValid || isSubmitting}
                            >
                                Update
                            </Button>
                            <button 
                                onClick={onDelete}
                                className="bg-white text-red-500 border border-red-500 p-2 rounded hover:bg-red-100"
                                aria-label="Delete"
                            >   
                            Delete
                            <DeleteIcon className="text-red-500" />
                            </button>
                        </div>
                    </form>
                </Form>
                <FileInput />
            </div>
        </div>
    );
}

export default TaskFlagDetailPage;
