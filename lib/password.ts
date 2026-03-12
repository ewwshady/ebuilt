// import bcrypt from "bcryptjs"

// export async function hashPassword(password: string): Promise<string> {
//   const salt = await bcrypt.genSalt(10)
//   return bcrypt.hash(password, salt)
// }

// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return bcrypt.compare(password, hashedPassword)
// }


import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

