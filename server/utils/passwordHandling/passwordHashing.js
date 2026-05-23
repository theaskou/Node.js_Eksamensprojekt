import bcrypt from "bcrypt";

const saltRounds = 12;

async function pwdHashing(password) {
  return await bcrypt.hash(password, saltRounds);
}

export default pwdHashing;
