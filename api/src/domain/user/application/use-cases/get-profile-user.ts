import { Either, left, right } from "@/core/either";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { Injectable } from "@nestjs/common";

interface GetProfileUserUseCaseRequest {
  userId: string;
}
type GetProfileUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class GetProfileUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUserUseCaseRequest): Promise<GetProfileUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    user.password = "";

    return right({
      user,
    });
  }
}
