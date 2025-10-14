import { BreadcrumbItem } from "@/types";

export function createCourseBreadcrumb(organizationId: number, additionalCrumbs: Array<BreadcrumbItem> = []) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Organization',
            href: '/organization/',
        },
        {
            title: String(organizationId),
            href: `/organization/${organizationId}`
        },
        {
            title: 'Course',
            href: route('listOrganizationCourse', { id: organizationId })
        },
        ...additionalCrumbs
    ];
    return breadcrumbs
}