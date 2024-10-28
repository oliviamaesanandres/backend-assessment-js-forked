// Custom error classes
export class DatabaseError extends Error {
  constructor(message: string, public readonly originalError: Error) {
    super(message);
    this.name = "DatabaseError";
  }
}
