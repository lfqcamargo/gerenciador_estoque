import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { PositionsRepository } from "../repositories/positions-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Position } from "../../enterprise/entities/position";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { PositionNotFoundError } from "./errors/position-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindPositionUseCaseRequest {
  authenticateId: string;
  positionId: string;
}

type FindPositionUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | PositionNotFoundError,
  { position: Position }
>;

@Injectable()
export class FindPositionByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private positionsRepository: PositionsRepository
  ) {}

  async execute({
    authenticateId,
    positionId,
  }: FindPositionUseCaseRequest): Promise<FindPositionUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const position = await this.positionsRepository.findById(positionId);
    if (!position) return left(new PositionNotFoundError());

    if (position.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ position: position });
  }
}
