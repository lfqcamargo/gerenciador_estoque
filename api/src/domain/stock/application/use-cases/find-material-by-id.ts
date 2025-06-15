import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { MaterialsRepository } from "../repositories/materials-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Material } from "../../enterprise/entities/material";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { MaterialNotFoundError } from "./errors/material-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindMaterialUseCaseRequest {
  authenticateId: string;
  materialId: string;
}

type FindMaterialUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | MaterialNotFoundError,
  { material: Material }
>;

@Injectable()
export class FindMaterialByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private materialsRepository: MaterialsRepository
  ) {}

  async execute({
    authenticateId,
    materialId,
  }: FindMaterialUseCaseRequest): Promise<FindMaterialUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const material = await this.materialsRepository.findById(materialId);
    if (!material) return left(new MaterialNotFoundError());

    if (material.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ material: material });
  }
}
