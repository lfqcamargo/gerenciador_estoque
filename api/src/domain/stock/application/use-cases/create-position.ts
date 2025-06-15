import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { PositionsRepository } from "../repositories/positions-repository";

import { Position } from "../../enterprise/entities/position";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsPositionError } from "./errors/already-exists-position-error";

interface CreatePositionUseCaseRequest {
  authenticateId: string;
  name: string;
  active: boolean;
}

type CreatePositionUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | AlreadyExistsPositionError,
  { position: Position }
>;

@Injectable()
export class CreatePositionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private positionsRepository: PositionsRepository
  ) {}

  async execute({
    authenticateId,
    name,
    active,
  }: CreatePositionUseCaseRequest): Promise<CreatePositionUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const existingPosition = await this.positionsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (existingPosition) {
      return left(new AlreadyExistsPositionError());
    }

    const position = Position.create({
      companyId: user.companyId,
      name,
      active,
    });

    await this.positionsRepository.create(position);

    return right({ position });
  }
}
