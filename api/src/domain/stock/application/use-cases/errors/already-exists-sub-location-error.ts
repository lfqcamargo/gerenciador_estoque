export class AlreadyExistsSubLocationError extends Error {
  constructor() {
    super("Sub-location already exists.");
  }
}
