import {TokenService} from "../services/token";
import {AppDataSource} from "../database";
import {BlacklistedToken} from "../database/models/blacklisted_tokens";


export const tokenService = new TokenService(AppDataSource.getRepository(BlacklistedToken));
