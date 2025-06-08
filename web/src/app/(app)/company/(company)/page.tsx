"use server";
import { getProfileCompany } from "@/http/get-profile-company";
import { EditCompany } from "./components/edit-company";

export default async function CompanyPage() {
  const company = await getProfileCompany();

  return <EditCompany company={company} />;
}
