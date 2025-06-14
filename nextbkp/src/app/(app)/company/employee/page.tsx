import { fetchUsers } from "@/http/fetch-users";
import { EmployeeContent } from "./components/employee-content";
import { getAttachement } from "@/http/get-attachement";

export default async function FuncionariosPage() {
  const employees = await fetchUsers();

  const employeesWithPhotoUrl = await Promise.all(
    employees.users.map(async (user) => {
      let photoUrl = null;

      if (user.photoId) {
        const attachement = await getAttachement({ id: user.photoId });
        photoUrl = attachement?.url || null;
      }

      return {
        ...user,
        photoUrl,
      };
    })
  );

  return <EmployeeContent employees={employeesWithPhotoUrl} />;
}
