import bcrypt from "bcrypt";

export const generateHash = async (password: string): Promise<string> => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error: any) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error: any) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
};
