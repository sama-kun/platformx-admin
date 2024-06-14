"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
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
import axiosInstance from "@/service/axiosInstance";
import ButtonLayout from "@/components/ButtonLayout";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
    flag: z.string().min(1, {
        message: "Flag is required",
    })
});

const TaskFlagCreatePage = () => {
    const router = useRouter();
    const {id} = useParams();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            flag: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axiosInstance.post("/task-flag", { ...values, module: id});
            // router.push(`/teacher/courses/${response.data.id}`);
            if (response.status < 300) {
                // console.log(response.data.data)
                toast.success("New Flag Task was successfully created")
                router.push('/teacher/module/'+id+'/task/flag/'+response.data.data.id)
            }
            console.log(response.data);
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    };

    return (
        <ButtonLayout>
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
                                    <FormLabel>Task Flag title</FormLabel>
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
                                    <FormLabel>Task Flag description</FormLabel>
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
                            {/* <Link href="/"> */}
                                <Button type="button" variant="ghost" onClick={() => router.push('/teacher/module/'+id)}>Cancel</Button>
                            {/* </Link> */}
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
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

export default TaskFlagCreatePage;
