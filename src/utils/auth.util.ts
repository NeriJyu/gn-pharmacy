import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodeErrorEnum } from "../api/enums/errors.enum";

export const splitAccessToken = (authorization: string): string => {
  return authorization.split(" ")[1];
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(StatusCodeErrorEnum.UNAUTHORIZED)
      .send({ status: "ERROR", message: "Token not provided" });
    return;
  }

  const token = splitAccessToken(authHeader);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    (req as any).user = decoded;

    next();
  } catch (err) {
    res
      .status(StatusCodeErrorEnum.FORBIDDEN)
      .send({ status: "ERROR", message: "Invalid or expired token" });
    return;
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      res
        .status(StatusCodeErrorEnum.FORBIDDEN)
        .send({ status: "ERROR", message: "Access denied" });
      return;
    }

    next();
  };
};
