import { describe, expect, it } from "vitest";
import { Either, left, right } from "@/core/either";

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10);
  } else {
    return left("error");
  }
}

describe("Either", () => {
  it("should return success result", () => {
    const result = doSomeThing(true);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it("should return error result", () => {
    const result = doSomeThing(false);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });
});
