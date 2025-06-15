import { GroupsRepository } from "../repositories/groups-repository";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { AlreadyExistsGroupError } from "./errors/already-exists-group-error";
import { Group } from "@/domain/stock/enterprise/entities/group";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface CreateGroupUseCaseRequest {
  userId: string;
  name: string;
  active: boolean;
}

type CreateGroupUseCaseResponse = Either<
  AlreadyExistsGroupError | UserNotFoundError,
  { group: Group }
>;

@Injectable()
export class CreateGroupUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private groupsRepository: GroupsRepository
  ) {}

  async execute({
    userId,
    name,
    active,
  }: CreateGroupUseCaseRequest): Promise<CreateGroupUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(UserNotFoundError);
    }

    const groupAlreadyExists = await this.groupsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (groupAlreadyExists) {
      return left(new AlreadyExistsGroupError());
    }

    const group = Group.create({
      companyId = user.companyId,
      name,
      active: true,
    });

    await this.groupsRepository.create(group);

    return right({ group });
  }
}
