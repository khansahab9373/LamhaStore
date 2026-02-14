import bcrypt from "bcrypt";

// password hashing
export const hashPasword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// password comparison
export const comparePassword = async (enteredPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};
