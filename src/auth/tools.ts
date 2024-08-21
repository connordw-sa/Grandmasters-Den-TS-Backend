import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Response } from "express";

// access token def
// return promise. Promisify will infer typeof secret as null (even if check is performed as below!)
interface TokenPayLoad {
  _id: string;
}

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("Not defined in env");
}

// create access token, expires in (1 week?)
export const createAccessToken = async (
  payload: TokenPayLoad
): Promise<string> => {
  // check if secret is in env

  return new Promise<string>((res, rej) => {
    jwt.sign(payload, secret, { expiresIn: "1 week" }, (err, token) => {
      // return token to user if !err
      if (err) {
        rej(err);
      } else {
        res(token as string);
      }
    });
  });
};

// verify access token based on env secret
export const verifyAccessToken = async (
  token: string
): Promise<TokenPayLoad> => {
  return new Promise<TokenPayLoad>((res, rej) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        rej(err);
      } else {
        res(decoded as TokenPayLoad);
      }
    });
  });
};

// error handler for common statuses

interface ErrorParams {
  status?: number;
  message?: string;
}

export const errorHandler = (err: ErrorParams, res: Response): Response => {
  // destructure status directly from err object
  const { status } = err;
  // use return to remove need for break within switch cases
  switch (true) {
    case status === 400 || err instanceof mongoose.Error.ValidationError:
      return res.status(400).send({ message: "Bad request" });
    case status === 401:
      return res.status(401).send({ message: "Unauthorized" });
    case status === 403:
      return res.status(403).send({ success: false, message: "Forbidden" });
    case status === 404:
      return res.status(404).send({ message: "Not found" });
    default:
      return res.status(500).send({ message: "Server Error" });
  }
};
