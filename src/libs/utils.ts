import { env } from '@/env'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password: string, associatedData?: string) => {
  const pepper = env.PASSWORD_HASHING_PEPPER
  let hash: string

  if (associatedData) {
    const payload = associatedData
    const secretKey = env.JWT_SECRET
    const token = jwt.sign(payload, secretKey)

    hash = await argon2.hash(password, {
      hashLength: 100,
      timeCost: 6,
      type: argon2.argon2id,
      secret: Buffer.from(pepper),
      associatedData: Buffer.from(token),
    })
  } else {
    hash = await argon2.hash(password, {
      hashLength: 100,
      timeCost: 6,
      type: argon2.argon2id,
      secret: Buffer.from(pepper),
    })
  }

  return hash
}
