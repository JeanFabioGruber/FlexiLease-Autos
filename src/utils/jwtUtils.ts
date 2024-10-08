import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "06f2d4eda93a6822";

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "100000000h" });
};

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
};

// eu fiz esse token sem validade para os test:

export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODljZTIzNWQzOGY1YTVmZDQzYTZlOCIsImlhdCI6MTcyMDMwNzIzOSwiZXhwIjozNjE3MjAzMDcyMzl9.A4NpEjmPwpqhaFDBUHK3NYcG63TY2WCjIJgTcs-liIc";
