import { useMemo } from "react"

const ADMIN_ROLE_ITEM = {
    label: 'Admin',
    value: 3
}
const SUPERVISOR_ROLE_ITEM = {
    label: 'Supervisor',
    value: 2
}
const TEACHER_ROLE_ITEM = {
    label: 'Teacher',
    value: 4
}
const STUDENT_ROLE_ITEM = {
    label: 'Student',
    value: 5
}

export function checkIsAuthorizedToAddOrganizationMember(role?: string) {
    const allowedRole = [
        'owner',
        'admin'
    ]
    if (!role) return false

    if (allowedRole.find(r => r === role)) {
        return true
    }
}

export function checkIsAuthorizedToEditOrganization(role?: string) {
    const allowedRole = [
        'owner',
        'admin'
    ]

    if (!role) return false

    if (allowedRole.find(r => r === role)) {
        return true
    }
}

export function getAllowedMemberCreationRole(role?: string) {
    switch (role) {
        case 'owner':
        case 'admin': 
            return [ADMIN_ROLE_ITEM, SUPERVISOR_ROLE_ITEM, TEACHER_ROLE_ITEM, STUDENT_ROLE_ITEM]
        default:
            return []
    }
}

function checkOrganizationRole(role?: string) {
    const ableToModifyMember = checkIsAuthorizedToAddOrganizationMember(role)
    const ableToModifyOrganization = checkIsAuthorizedToEditOrganization(role)

    return ({
        ableToModifyMember,
        ableToModifyOrganization
    })
}

export const useOrganizationRole = (role?: string) => {
    const t = useMemo(() => checkOrganizationRole(role), [role])
    return t
}