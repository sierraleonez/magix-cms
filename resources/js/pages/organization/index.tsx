import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, iOrganizationsWithRole } from "@/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrashIcon, PencilLine, PenBoxIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Organization',
    href: '/organization/',
  },
];

const styleClass = {
  tableData: "p-2 text-start border-solid border border-black dark:border-white"
}

export default function ListOrganization({ organizations }: { organizations: iOrganizationsWithRole }) {
  const { delete: deleteFn, processing } = useForm()

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    organizationId: 0
  })

  function deleteOrganization() {
    deleteFn(route('deleteOrganization', dialogState.organizationId))
    closeDeleteDialog()
  }

  function setDialogOpenState(open: boolean) {
    setDialogState({
      ...dialogState,
      isOpen: open
    })
  }

  function openDeleteDialog(organizationId: number) {
    setDialogState({
      isOpen: true,
      organizationId
    })
  }

  function closeDeleteDialog() {
    setDialogState({
      ...dialogState,
      isOpen: false
    })
  }

  function redirectToCreateOrganization() {
    document.location.href = route('createOrganization')
  }

  function redirectToEditOrganization(id: number) {
    document.location.href = route('renderUpdateOrganization', id)
  }

  function showOrganization(id: number) {
    document.location.href = route('showOrganization', id)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex justify-end '>
        <Button onClick={redirectToCreateOrganization}>
          <p>Create Organization</p>
        </Button>
      </div>
      <div className="p-4 flex flex-col gap-y-3">
        <table className="border-solid border border-white outline outline-1 outline-gray-400 overflow-hidden rounded-lg">
          <thead>
            <tr>
              <th className={styleClass.tableData}>Name</th>
              <th className={styleClass.tableData}>Role</th>
              <th className={styleClass.tableData}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              organizations?.map((organization) => (
                <tr key={organization.id} onClick={() => showOrganization(organization.id)}>
                  <td className={styleClass.tableData}>{organization.organization_name}</td>
                  <td className={styleClass.tableData}>{organization.role}</td>
                  <td className={styleClass.tableData}>
                    <div className="flex gap-x-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          redirectToEditOrganization(organization.id)
                        }}
                      >
                        <PenBoxIcon />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteDialog(organization.id)
                        }}
                        variant={"destructive"}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Dialog open={dialogState.isOpen} onOpenChange={setDialogOpenState}>
          <DialogContent>
            <DialogTitle>Are you sure you want to delete your organization?</DialogTitle>
            <DialogDescription>Once your organization is deleted, all of its resources and data will also be permanently deleted. Please enter your password
              to confirm you would like to permanently delete your account.</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" onClick={closeDeleteDialog}>
                  Cancel
                </Button>
              </DialogClose>

              <Button variant="destructive" disabled={processing} asChild>
                <button onClick={deleteOrganization}>Delete</button>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  )
}