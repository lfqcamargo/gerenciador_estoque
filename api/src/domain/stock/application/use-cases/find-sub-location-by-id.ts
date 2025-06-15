import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { SubsLocationRepository } from "../repositories/subs-location-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { SubLocation } from "../../enterprise/entities/sub-location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { SubLocationNotFoundError } from "./errors/sub-location-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindSubLocationUseCaseRequest {
  authenticateId: string;
  sublocationId: string;
}

type FindSubLocationUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | SubLocationNotFoundError,
  { sublocation: SubLocation }
>;

@Injectable()
export class FindSubLocationByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private subslocationRepository: SubsLocationRepository
  ) {}

  async execute({
    authenticateId,
    sublocationId,
  }: FindSubLocationUseCaseRequest): Promise<FindSubLocationUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const sublocation =
      await this.subslocationRepository.findById(sublocationId);
    if (!sublocation) return left(new SubLocationNotFoundError());

    if (sublocation.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ sublocation: sublocation });
  }
}
