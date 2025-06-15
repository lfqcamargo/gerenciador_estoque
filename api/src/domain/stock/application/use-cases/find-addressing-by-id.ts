import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { AddressingsRepository } from "../repositories/addressings-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Addressing } from "../../enterprise/entities/addressing";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { AddressingNotFoundError } from "./errors/addressing-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindAddressingUseCaseRequest {
  authenticateId: string;
  addressingId: string;
}

type FindAddressingUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | AddressingNotFoundError,
  { addressing: Addressing }
>;

@Injectable()
export class FindAddressingByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private addressingsRepository: AddressingsRepository
  ) {}

  async execute({
    authenticateId,
    addressingId,
  }: FindAddressingUseCaseRequest): Promise<FindAddressingUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const addressing = await this.addressingsRepository.findById(addressingId);
    if (!addressing) return left(new AddressingNotFoundError());

    if (addressing.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ addressing: addressing });
  }
}
