import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";

export abstract class TempCompaniesRepository {
  abstract create(tempCompany: TempCompany): Promise<void>;
  abstract findByEmail(email: string): Promise<TempCompany | null>;
  abstract findByCnpj(cnpj: string): Promise<TempCompany | null>;
  abstract findByToken(token: string): Promise<TempCompany | null>;
  abstract delete(tempCompany: TempCompany): Promise<void>;
  abstract deleteByCnpj(cnpj: string): Promise<void>;
}
