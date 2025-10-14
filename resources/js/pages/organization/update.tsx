import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, iOrganization } from "@/types";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { iCreateOrganizationFormValue } from "./type/form";
import OrganizationForm from "./components/createForm";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Update Organization',
        href: '/organization/update',
    },
];

export default function UpdateOrganization({ organization }: { organization: iOrganization }) {
    console.log(organization.is_public)
    const form = useForm<Required<iCreateOrganizationFormValue>>({
        organization_name: organization.organization_name,
        description: organization.description,
        is_public: !!organization.is_public
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        form.patch(route('storeOrganizationUpdate', {id: organization.id}))
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


