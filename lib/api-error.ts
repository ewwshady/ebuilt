import { NextResponse } from "next/server"

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string>
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown, defaultMessage: string = "Internal server error") {
  console.error("[API Error]", error)

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.errors && { errors: error.errors }),
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    )
  }

  // Generic error response
  return NextResponse.json(
    { error: defaultMessage },
    { status: 500 }
  )
}

export function createValidationError(errors: Record<string, string>) {
  return new APIError(400, "Validation failed", errors)
}

export function createNotFoundError(resource: string = "Resource") {
  return new APIError(404, `${resource} not found`)
}

export function createUnauthorizedError(message: string = "Unauthorized") {
  return new APIError(401, message)
}

export function createForbiddenError(message: string = "Forbidden") {
  return new APIError(403, message)
}

export function createConflictError(message: string = "Resource already exists") {
  return new APIError(409, message)
}

export function createInternalError(message: string = "Internal server error") {
  return new APIError(500, message)
}
