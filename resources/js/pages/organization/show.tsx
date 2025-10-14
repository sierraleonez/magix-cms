import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation";
import MagixDropdown from "@/components/dropdown";
import TableToolbox from "@/components/table/tableToolbox";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { globalStyleClass } from "@/style";
import { BreadcrumbItem, iOrganization, iOrganizationMemberRole, iOrganizationMembers } from "@/types";
import { parseErrorMessage } from "@/utils/error";
import { checkIsAuthorizedToAddOrganizationMember, getAllowedMemberCreationRole, useOrganizationRole } from "@/utils/role";
import { useForm, Link } from "@inertiajs/react";
import { Edit, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

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
    title: '',
    href: ''
  }
];

export default function ShowOrganization({ members, organization, role }: { members: iOrganizationMembers; organization: iOrganization; role: iOrganizationMemberRole }) {
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [deleteMemberDialogState, setDeleteMemberDialogState] = useState({
    isOpen: false,
    memberId: 0
  })

  const { delete: deleteFn, errors, wasSuccessful, resetAndClearErrors } = useForm()

  useEffect(() => {
    console.log(errors)
  }, [errors])

  useEffect(() => {
    if (wasSuccessful) {
      closeDeleteMemberDialog()
      resetAndClearErrors()
    }
  }, [wasSuccessful])

  function deleteMember() {
    deleteFn(route('deleteOrganizationMember', { member_id: deleteMemberDialogState.memberId, id: organization.id }), {
      onSuccess: () => {
        toast('Member deleted')
        closeDeleteMemberDialog()
        resetAndClearErrors()
      },
      onError: (err) => {
        const message = parseErrorMessage(err)
        toast(message)
        resetAndClearErrors()
      }
    })
  }

  function closeDeleteMemberDialog() {
    setDeleteMemberDialogState({
      isOpen: false,
      memberId: 0
    })
  }

  function openDeleteMemberDialog(memberId: number) {
    setDeleteMemberDialogState({
      isOpen: true,
      memberId
    })
  }

  function setDeleteMemberDialogOpen(isOpen: boolean) {
    setDeleteMemberDialogState({
      ...deleteMemberDialogState,
      isOpen
    })
  }

  function openAddMemberDialog() {
    setIsAddMemberDialogOpen(true)
  }

  function closeAddMemberDialog() {
    setIsAddMemberDialogOpen(false)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs} >
      <div className="grid grid-cols-2 p-3 gap-3">
        <OrganizationDetailCard
          organization={organization}
          role={role}
        />
        <Card>
          <CardHeader>
            <CardTitle>
              Course Highlight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={route('listOrganizationCourse', organization.id)}>Course</Link>
          </CardContent>
        </Card>
        <OrganizationMembersCard
          members={members}
          role={role}
          onClickAddMember={openAddMemberDialog}
          onClickDeleteMember={openDeleteMemberDialog}
        />
      </div>
      <AddOrganizationMemberDialog
        organizationId={organization.id}
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onClose={closeAddMemberDialog}
        role={role}
      />
      <DeleteConfirmationDialog
        isOpen={deleteMemberDialogState.isOpen}
        onClickDelete={deleteMember}
        onIsOpenChange={setDeleteMemberDialogOpen}
        title="Are you sure you want to remove this member from your organization?"
        description="Once member is removed, all of its resources and data will also be permanently deleted."
      />
    </AppLayout>
  )
}

interface iOrganizationDetailCardProps {
  organization: iOrganization;
  role: iOrganizationMemberRole
  // onClickEditOrganization: () => void;
}

function OrganizationDetailCard({ organization, role }: iOrganizationDetailCardProps) {
  const isPublicOrganization = !!organization.is_public
  const publicStatusLabel = `(${(isPublicOrganization ? "Public" : "Private") + " Organization"})`
  const { ableToModifyOrganization } = useOrganizationRole(role)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {organization.organization_name} {publicStatusLabel}
        </CardTitle>
        {
          ableToModifyOrganization && (
            <Link href={route("renderUpdateOrganization", organization.id)}>
              <Button>
                <Edit />
              </Button>
            </Link>

          )
        }
      </CardHeader>
      <CardContent>
        <CardDescription>
          {organization.description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

interface iOrganizationMembersCardProps {
  members: iOrganizationMembers;
  onClickAddMember: () => void;
  onClickDeleteMember: (memberid: number) => void;
  role: string;
}

function OrganizationMembersCard({ members, onClickAddMember, role, onClickDeleteMember }: iOrganizationMembersCardProps) {
  const { ableToModifyMember } = useOrganizationRole(role)

  return (
    <Card className="col-span-2">
      <CardHeader className="gap-y-4 flex flex-row items-center justify-between">
        <CardTitle>
          Members
        </CardTitle>
        {
          ableToModifyMember && (
            <Button onClick={onClickAddMember}>
              <Plus />
            </Button>
          )
        }
      </CardHeader>

      <CardContent>
        <div className="flex flex-1 flex-col">
          <table className={globalStyleClass.tableBody}>
            <thead>
              <tr>
                <th className={globalStyleClass.tableData}>Name</th>
                <th className={globalStyleClass.tableData}>Role</th>
                {
                  ableToModifyMember && (
                    <th className={globalStyleClass.tableData}>Action</th>
                  )
                }
              </tr>
            </thead>
            <tbody>
              {
                members.map((member) => (
                  <tr key={member.id}>
                    <td className={globalStyleClass.tableData}>{member.name}</td>
                    <td className={globalStyleClass.tableData}>{member.role_name}</td>
                    {
                      ableToModifyMember && (
                        <td className={globalStyleClass.tableData}>
                          <TableToolbox
                            onClickDelete={() => onClickDeleteMember(member.id)}
                            onClickEdit={() => { }}
                          />
                        </td>
                      )
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>

        </div>
      </CardContent>
    </Card>
  )
}

interface iAddOrganizationMemberDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  organizationId: number;
  role: iOrganizationMemberRole
}


function AddOrganizationMemberDialog({
  onClose,
  onOpenChange,
  open,
  organizationId,
  role
}: iAddOrganizationMemberDialogProps) {
  const {
    data,
    setData,
    post,
    errors,
    processing,
    clearErrors,
    wasSuccessful,
    resetAndClearErrors
  } = useForm<Required<{
    email: string;
    organization_id: number;
    organization_role_id: number;
  }>>({
    email: '',
    organization_id: organizationId,
    organization_role_id: 4
  })

  const OrganizationRoles = getAllowedMemberCreationRole(role)
  const roleLabel = useMemo(() => {
    if (data.organization_role_id) {
      return OrganizationRoles.find(e => e.value === data.organization_role_id)?.label || ""
    } else {
      return ""
    }
  }, [data.organization_role_id])

  function addMember() {
    post(route('storeOrganizationMember', organizationId), {
      onSuccess: (params) => {
        onClose()
        toast("Member added")
        resetAndClearErrors()
      },
      onError: (err) => {
        const message = parseErrorMessage(err)
        toast(message)
        clearErrors()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Organization Member</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <Input
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            type="email"
            placeholder="Input registered user name or email"
          />

          <MagixDropdown
            items={OrganizationRoles}
            label=""
            onItemClick={(item) => { setData('organization_role_id', item.value) }}
            selectedValue={roleLabel}
            placeholder="Select Type"
          />

        </div>
        <DialogFooter>
          <Button disabled={processing} onClick={addMember}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}