import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UserPayload = {
    id: string;
  }

export const generateJWT = ({id}: UserPayload) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })
    return token
}