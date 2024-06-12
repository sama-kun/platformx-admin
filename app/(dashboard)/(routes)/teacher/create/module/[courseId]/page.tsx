"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import JoditEditorUI from '../../../../../../../components/ui/joditEditor';

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
import ButtonLayout from "@/components/ButtonLayout";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    })
});

const CreateModulePage = () => {
    const router = useRouter();
    const {courseId} = useParams();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axiosInstance.post("/module", {...values, course: courseId});
            // router.push(`/teacher/courses/${response.data.id}`);
            console.log(response);
            if (response.status < 300){
                toast.success('Module was created successfully')
                router.push("/teacher/courses/"+courseId);
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <ButtonLayout>
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your module</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your module? Don not worry, you can change it later.
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
                                    <FormDescription>What will you teach in this module?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Module description</FormLabel>
                                    <FormControl>
                                        <JoditEditorUI 
                                            disabled={isSubmitting}
                                            name="description"
                                            control={form.control}
                                        />
                                    </FormControl>
                                    <FormDescription>Describe the content of your module.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href={"/teacher/courses/"+courseId}>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </Link>
                            <Button 
                                type="submit"
                                // disabled={!isValid || isSubmitting}
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        </ButtonLayout>
    );
}

export default CreateModulePage;
