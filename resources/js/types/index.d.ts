import { LucideIcon } from 'lucide-react';
import { Descendant } from 'slate';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

type iOrganizationMemberRole = "owner" | "admin" | "supervisor"
type iCourseMaterialType = "material" | "quiz";

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface iOrganization {
    id: number;
    is_public: boolean;
    organization_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface iOrganizationMember {
    id: number;
    user_id: number
    organization_id: number;
    organization_role_id: number;
    role_name: string;
    name: string;
    email: string;
}

export interface iCourse {
    id: number;
    created_by: number;
    name: string;
    description: string;
    tags: string;
    organization_id: number;
    is_paid: number;
    subscription_price: number;
}

export interface iCourseTopic {
    id: number;
    course_id: number;
    created_by: number;
    description: string;
    name: string;
}

export interface iCourseMember {
    id: number;
    course_id: number;
    organization_member_id: number;

}

export interface iCourseQuiz {
    id: number;
    question: Array<Descendant>;
    answer: number;
    options: Array<iQuizOption>;
    created_by: number;
    reason: string;
}

export interface iQuizOption {
    id: number;
    option: string;
}

export interface iCourseMaterial {
    id: number;
    title: string;
    description: string;
    order: number;
    created_by: number;
    content: Array<Descendant>
    course_topic_id: number;
    type: iCourseMaterialType;
    course_quiz: Array<iCourseQuiz>;
}

export interface iCourseProgress {
    id: number;
    course_material_id: number;
    course_member_id: number;
    is_finished: boolean;
}

export interface iCourseInvitation {
    id: number;
    user_id: number;
    course_id: number;
    course: iCourse
}

export interface iCourseMaterialWithProgress extends iCourseMaterial {
    progress: iCourseProgress | null;
}

export interface iCourseTopicWithMaterials extends iCourseTopic {
    course_materials: iCourseMaterialsWithProgress
}

type iCourseMemberDetail = iCourseMember & { detail: User }

export type iOrganizationWithRole = iOrganization & { role: iOrganizationMemberRole }
export type iOrganizationsWithRole = Array<iOrganizationWithRole>
export type iOrganizations = Array<iOrganization>
export type iOrganizationMembers = Array<iOrganizationMember>
export type iCourses = Array<iCourse>
export type iCourseTopics = Array<iCourseTopic>
export type iCourseMembers = Array<iCourseMember>
export type iCourseMemberDetails = Array<iCourseMemberDetail>
export type iCourseMaterials = Array<iCourseMaterial>;
export type iCourseMaterialsWithProgress = Array<iCourseMaterialWithProgress>;
export type iCourseTopicsWithMaterials = Array<iCourseTopicWithMaterials>
export type iQuizOptions = Array<iQuizOption>;
export type iCourseInvitations = Array<iCourseInvitation>;
