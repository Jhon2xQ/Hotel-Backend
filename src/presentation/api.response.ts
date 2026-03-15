export class ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T | null;
  readonly timestamp: number;

  private constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data ?? null);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message, null);
  }
}
