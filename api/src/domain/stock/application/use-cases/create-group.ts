import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { GroupsRepository } from "../repositories/groups-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Group } from "../../enterprise/entities/group";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsGroupError } from "./errors/already-exists-group-error";

interface CreateGroupUseCaseRequest {
  authenticateId: string;
  name: string;
  active: boolean;
}

type CreateGroupUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | AlreadyExistsGroupError,
  { group: Group }
>;

@Injectable()
export class CreateGroupUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private groupsRepository: GroupsRepository
  ) {}

  async execute({
    authenticateId,
    name,
    active,
  }: CreateGroupUseCaseRequest): Promise<CreateGroupUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const groupName = await this.groupsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (groupName) {
      return left(new AlreadyExistsGroupError());
    }

    const group = Group.create({
      companyId: user.companyId,
      name,
      active,
    });

    await this.groupsRepository.create(group);

    return right({ group: group });
  }
}
