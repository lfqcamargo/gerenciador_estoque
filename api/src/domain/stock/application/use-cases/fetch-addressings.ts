import { Either, left, right } from "@/core/either";
import { Addressing } from "../../enterprise/entities/addressing";
import { AddressingsRepository } from "../repositories/addressings-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchAddressingsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchAddressingsUseCaseResponse = Either<
  UserNotFoundError,
  {
    addressings: Addressing[] | null;
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
export class FetchAddressingsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private addressingsRepository: AddressingsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchAddressingsUseCaseRequest): Promise<FetchAddressingsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.addressingsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        addressings: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ addressings: result?.data, meta: result?.meta });
  }
}
