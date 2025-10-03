import jwt from "jsonwebtoken";
import { UserModelClass } from "../models/userModel.js";
import { UserUtils } from "../utils/validator.js";

export class UserService {
  constructor() {
    this.repository = new UserModelClass();
  }

  normalizeRegistrationFields(user) {
    user = UserUtils.trimAll(user);
    user.email = UserUtils.lowercase(user.email);
    user.username = UserUtils.lowercase(user.username);
    return user;
  }

  validateRegistrationRequiredFields(user) {
    const keys = Object.keys(user || {});
    if (!keys.length) UserUtils.throwError(400, "Invalid request (insufficient data in the body)");
    if (!keys.includes("username")) UserUtils.throwError(400, "Missing 'username'");
    if (!keys.includes("email")) UserUtils.throwError(400, "Missing 'email'");
    if (!keys.includes("password")) UserUtils.throwError(400, "Missing 'password'");
    // nombres/apellidos/role opcionales; añade si los quieres obligatorios
  }

  validateLoginRequiredFields(payload) {
    const keys = Object.keys(payload || {});
    if (!keys.length) UserUtils.throwError(400, "Invalid request (insufficient data in the body)");
    if (!keys.includes("email")) UserUtils.throwError(400, "Missing 'email'");
    if (!keys.includes("password")) UserUtils.throwError(400, "Missing 'password'");
  }

  validateRegistrationFieldsFormat(user) {
    if (!UserUtils.isValidEmail(user.email ?? "")) UserUtils.throwError(400, "Invalid email");
    if (!UserUtils.isValidUsername(user.username ?? "")) UserUtils.throwError(400, "Invalid username");
    if (!UserUtils.isSafePassword(user.password ?? "")) UserUtils.throwError(400, "Unsafe password (min 6 chars)");
  }

  validateJWTparameters(secret, expiresIn) {
    if (!secret) UserUtils.throwError(400, "Invalid request (undefined env JWT_SECRET)");
    // "30m", "1h" o "3600"
    let exp = expiresIn?.trim();
    if (!UserUtils.isTimeString(exp)) return { secret, expiresIn: "30m" };
    return { secret, expiresIn: exp };
  }

  async validateRegistrationFieldsUniqueness(user) {
    const emailExists = await this.repository.findPublicByEmail(user.email);
    if (emailExists) UserUtils.throwError(409, "Email already registered");
    const usernameExists = await this.repository.findPublicByUsername(user.username);
    if (usernameExists) UserUtils.throwError(409, "Username already registered");
  }

  defineAvatar(user) {
    if (!user.avatar_url) {
      return user.role === "admin"
        ? "https://i.postimg.cc/XNHhZdnf/admin-purple.png"
        : "https://i.postimg.cc/76qczNCV/user-purple.png";
    }
    return user.avatar_url;
  }

  async searchDefaultStatus(initialStatusName) {
    const statusDoc = await this.statusRepository.findByName(initialStatusName);
    if (!statusDoc?.code) UserUtils.throwError(500, "Status 'active' not configured");
    return statusDoc.code;
  }

  async validateRegistration(user) {
    if (!UserUtils.isPlainObject(user)) UserUtils.throwError(400, "Invalid body");
    this.validateRegistrationRequiredFields(user);
    this.validateRegistrationFieldsFormat(user);
    user = this.normalizeRegistrationFields(user);
    await this.validateRegistrationFieldsUniqueness(user);
    return user;
  }

  async verifyCredentials(payload) {
    if (!UserUtils.isPlainObject(payload)) UserUtils.throwError(400, "Invalid body");
    this.validateLoginRequiredFields(payload);
    const email = UserUtils.lowercase(payload.email);

    // si no usas status_code aún, pásalo como null
    const statusCode = 1; // “active”
    const credentials = await this.repository.findCredentialsByEmailStatusCode(email, statusCode);
    if (!credentials) UserUtils.throwError(401, "Incorrect email or password");

    const ok = await UserUtils.verify(payload.password, credentials.password_hash);
    if (!ok) UserUtils.throwError(401, "Incorrect email or password");

    return credentials; // {_id, role, password_hash, ...}
  }

  async register(user) {
    user = await this.validateRegistration(user);

    const creationDate = new Date();
    const doc = {
      username: user.username,
      email: user.email,
      password_hash: await UserUtils.hash(user.password),
      password_updated_at: creationDate,
      role: user.role || "user",
      avatar_url: this.defineAvatar(user),
      status_code: await this.searchDefaultStatus("active"),
      createdAt: creationDate,
      updatedAt: creationDate,
    };

    const InsertOneResult = await this.repository.create(doc);

    const publicUser = {
      _id: InsertOneResult.insertedId,
      username: doc.username,
      email: doc.email,
      role: doc.role,
      avatar_url: doc.avatar_url,
      status_code: doc.status_code,
      createdAt: doc.createdAt,
    };

    return { status: 201, data: publicUser };
  }

  async signIn(payload) {
    const credentials = await this.verifyCredentials(payload);
    const { secret, expiresIn } = this.validateJWTparameters(
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES || "1h"
    );
    const token = jwt.sign({ _id: credentials._id, role: credentials.role }, secret, { expiresIn });
    const redirect = credentials.role === "admin" ? "/html/main_admin.html" : "/html/main.html";
    return { status: 200, token, redirect, expiresIn };
  }
}



