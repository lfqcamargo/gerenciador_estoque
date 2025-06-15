import { Either, left, right } from "@/core/either";
import { Material } from "../../enterprise/entities/material";
import { MaterialsRepository } from "../repositories/materials-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchMaterialsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchMaterialsUseCaseResponse = Either<
  UserNotFoundError,
  {
    materials: Material[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }
>;

@Injectable()
export class FetchMaterialsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private materialsRepository: MaterialsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchMaterialsUseCaseRequest): Promise<FetchMaterialsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.materialsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        materials: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ materials: result?.data, meta: result?.meta });
  }
}
