import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { MaterialsRepository } from "../repositories/materials-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Material } from "../../enterprise/entities/material";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsMaterialError } from "./errors/already-exists-material-error";
import { GroupsRepository } from "../repositories/groups-repository";
import { GroupNotFoundError } from "./errors/group-not-found-error";

interface CreateMaterialUseCaseRequest {
  authenticateId: string;
  groupId: string;
  name: string;
  active: boolean;
}

type CreateMaterialUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | AlreadyExistsMaterialError,
  { material: Material }
>;

@Injectable()
export class CreateMaterialUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private groupsRepository: GroupsRepository,
    private materialsRepository: MaterialsRepository
  ) {}

  async execute({
    authenticateId,
    groupId,
    name,
    active,
  }: CreateMaterialUseCaseRequest): Promise<CreateMaterialUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const group = await this.groupsRepository.findById(groupId);

    if (!group) {
      return left(new GroupNotFoundError());
    }

    const existingMaterial = await this.materialsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (existingMaterial) {
      return left(new AlreadyExistsMaterialError());
    }

    const material = Material.create({
      companyId: user.companyId,
      groupId: group.id,
      name,
      active,
    });

    await this.materialsRepository.create(material);

    return right({ material });
  }
}
