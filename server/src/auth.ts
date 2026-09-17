import 'dotenv/config'
import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-troque-em-producao'
const JWT_EXPIRES = process.env.JWT_EXPIRES ?? '7d'

export interface AuthRequest extends Request {
  userId?: string
}

export function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10)
}

export function conferirSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash)
}

export function gerarToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions)
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token ausente.' })
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as jwt.JwtPayload
    req.userId = String(payload.sub)
    next()
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}
