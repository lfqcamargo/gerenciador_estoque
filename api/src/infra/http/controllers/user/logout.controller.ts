import { Controller, Get, HttpCode, Res } from "@nestjs/common";
import { Response } from "express";

@Controller("users/logout")
export class LogoutController {
  @Get()
  @HttpCode(200)
  async handle(@Res() res: Response) {
    console.log("ANTES DO CLEAR");
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.send({ message: "Logged out" });
  }
}
