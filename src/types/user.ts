// import { JwtPayload } from "jsonwebtoken";  // Import the JwtPayload from jsonwebtoken

import { JwtPayload } from "jwt-decode";

export type TUser = JwtPayload & {
  email: string;
  _id: string;
  name: string;
  phone: string;
  isBlocked: boolean;
  iat: number;
  exp: number;
  role: "customer" | "admin";

};
