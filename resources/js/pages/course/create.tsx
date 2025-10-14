import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { parseErrorMessage } from "@/utils/error";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { useRoute } from "ziggy-js";
import { createCourseBreadcrumb } from "./breadcrumbs";
import MagixSwitch from "@/components/switch";

interface iCreateCourseForm {
    name: string;
    description: string;
    tags: string;
    is_paid: boolean;
    subscription_price: number;
}

export default function CreateCourse() {
    const { data, setData, post, errors, resetAndClearErrors } = useForm<Required<iCreateCourseForm>>({
        description: '',
        tags: '',
        name: '',
        is_paid: false,
        subscription_price: 0,
    })

    const router = useRoute()
    const params = router().params
    const organizationId = params?.id

    const breadcrumbs = createCourseBreadcrumb(Number(organizationId), [{
        href: 'create',
        title: 'Create'
    }])

    function submitCourseCreation(organizationId: string) {
        post(route('storeOrganizationCourse', organizationId), {
            onError: err => {
                const message = parseErrorMessage(err)
                toast(message)
                resetAndClearErrors()
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <form onSubmit={(e) => { e.preventDefault(); submitCourseCreation(organizationId) }}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label>Course Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Course Description</Label>
                            <Input
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Course Tags</Label>
                            <Input
                                value={data.tags}
                                onChange={(e) => setData('tags', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Is Paid</Label>
                            <MagixSwitch
                                isChecked={data.is_paid}
                                setIsChecked={(val) => setData('is_paid', val)}
                            />
                        </div>
                        {
                            data.is_paid && (
                                <div>
                                    <Label>Subscription Price</Label>
                                    <Input
                                        type="number"
                                        value={data.subscription_price}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setData('subscription_price', val)
                                        }}
                                    />
                                </div>
                            )
                        }
                        <Button
                            // onClick={(e) => {
                            //     e.preventDefault();
                            //     // submitCourseCreation(organizationId);
                            // }}
                            type="submit"
                        >
                            Create
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    )
}