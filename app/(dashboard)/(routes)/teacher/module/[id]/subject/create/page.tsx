"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
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
    const {id} = useParams(); 
    const router = useRouter();
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
            const response = await axiosInstance
            .post("/subject", 
            {...values, module: id});
            // router.push(`/teacher/courses/${response.data.id}`);
            if(response.status < 300){
                toast.success("New Subject was successfully created")
                router.push('/teacher/module/'+id+'/subject/'+response.data.data.id)
            }
            console.log(values)
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <ButtonLayout>
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your Subject</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your subject? Don't worry, you can change it later.
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
                            <Link href={"/module/"+id} >
                                <Button type="button" variant="ghost">Cancel</Button>
                            </Link>
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

export default ModuleDetailPage;
