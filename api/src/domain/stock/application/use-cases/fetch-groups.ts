import { Either, left, right } from "@/core/either";
import { Group } from "../../enterprise/entities/group";
import { GroupsRepository } from "../repositories/groups-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchGroupsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchGroupsUseCaseResponse = Either<
  UserNotFoundError,
  {
    groups: Group[] | null;
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
export class FetchGroupsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private groupsRepository: GroupsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchGroupsUseCaseRequest): Promise<FetchGroupsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.groupsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        groups: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ groups: result?.data, meta: result?.meta });
  }
}
