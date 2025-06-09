"use server";
import { getProfileCompany } from "@/http/get-profile-company";
import { EditCompany } from "./components/edit-company";
import { getAttachement } from "@/http/get-attachement";

export default async function CompanyPage() {
  const company = await getProfileCompany();

  const attachement = await getAttachement({ id: company.photoId });

  return (
    <EditCompany company={{ ...company, urlPhoto: attachement?.url || null }} />
  );
}
