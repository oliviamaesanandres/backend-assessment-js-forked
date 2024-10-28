export class Logger {
  static info(message: string, meta?: Record<string, unknown>): void {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  }

  static error(
    message: string,
    error?: Error,
    meta?: Record<string, unknown>
  ): void {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error?.message,
        stack: error?.stack,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  }
}
