export class HttpError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);

  } 
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
