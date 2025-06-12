import { User } from "@/domain/user/enterprise/entities/user";

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      companyId: user.companyId.toString(),
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      photoId: user.photoId,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString() ?? null,
    };
  }
}
