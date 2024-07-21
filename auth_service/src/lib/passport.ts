// user-service/src/config/passport.ts

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import {UserService} from "../services/user";
import {UserRepository} from "../database/repositories/user";

const userService = new UserService();
const userRepository = new UserRepository();

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await userService.validateUser(email, password);
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
    },
    async (jwtPayload, done) => {
        try {
            const user = await userRepository.findById(jwtPayload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;
