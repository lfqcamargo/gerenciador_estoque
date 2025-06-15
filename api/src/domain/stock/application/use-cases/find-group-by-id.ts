import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { GroupsRepository } from "../repositories/groups-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Group } from "../../enterprise/entities/group";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { GroupNotFoundError } from "./errors/group-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindGroupUseCaseRequest {
  authenticateId: string;
  groupId: string;
}

type FindGroupUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | GroupNotFoundError,
  { group: Group }
>;

@Injectable()
export class FindGroupByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private groupsRepository: GroupsRepository
  ) {}

  async execute({
    authenticateId,
    groupId,
  }: FindGroupUseCaseRequest): Promise<FindGroupUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const group = await this.groupsRepository.findById(groupId);
    if (!group) return left(new GroupNotFoundError());

    if (group.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ group: group });
  }
}
