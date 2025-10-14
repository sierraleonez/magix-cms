import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Switch } from "@headlessui/react";
import { InertiaFormProps, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { iCreateOrganizationFormValue } from "./type/form";
import OrganizationForm from "./components/createForm";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Create Organization',
        href: '/organization/create',
    },
];

export default function CreateOrganization() {
    const form = useForm<Required<iCreateOrganizationFormValue>>({
        organization_name: '',
        description: '',
        is_public: false
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        form.post(route('storeOrganization'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <OrganizationForm
                    form={form}
                    onSubmit={submit}
                />
            </div>
        </AppLayout>
    )
}


