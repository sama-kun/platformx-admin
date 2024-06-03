"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import JoditEditorUI from '../../../../../../../../components/ui/joditEditor';

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
import axiosInstance from "@/service/axiosInstance";
import ModuleLayout from "../../../layout";
import { useEffect, useCallback } from 'react';
import ButtonLayout from "@/components/ButtonLayout";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    })
});

const ModuleDetailPage = () => {
    const {subjectId, id} = useParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const fetchSubject = useCallback(async () => {
        const response = await axiosInstance.get('/subject/'+subjectId);
        console.log(response.data);
        form.reset({
            title: response.data.data.title,
            description: response.data.data.description,
        });
    }, [subjectId, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axiosInstance.patch(`/subject/${subjectId}`, {...values, module: id});
            console.log(response.data);
            if(response.status < 300) {
                toast.success("Subject successfully updated")
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchSubject();
    }, [fetchSubject])

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your Subject</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your subject? Don not worry, you can change it later.
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
                                    <FormDescription>What will you teach in this subject?</FormDescription>
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
                                    <FormDescription>Describe the content of your subject.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            {/* <Link href="/"> */}
                                <Button type="button" variant="ghost" onClick={() => fetchSubject()}>Cancel</Button>
                            {/* </Link> */}
                            <Button 
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default ModuleDetailPage;
