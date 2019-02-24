import { User, UserModel } from "../../entity/User";
import * as jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

export async function register(username, firstName, lastName, email, password, confirmPassword): Promise<{ user?: Document, error?: string }> {
    try {
        if (!username || !password || !firstName || !lastName || !email || !confirmPassword) {
            throw new Error('Not all fields are submited');
        }
        if(password !== confirmPassword) {
            throw new Error('Passwords are not matching')
        }
        let oldUser = await User.findOne({
            username
        });
        if (oldUser) {
            throw new Error('User already exists')
        }
        let user = new User({
            password,
            username,
            email,
            firstName,
            lastName
        });
        await user.save();
        return {
            user
        }
    } catch (error) {
        return {
            error: error.message
        }
    }
}

export async function login(username, password): Promise<{ token?: string, error?: string, expiresIn?: number, id?: string}> {
    let SECRET = process.env.SECRET;
    try {
        const user = await User.findOne({
            username
        }).exec();
        if(!user) {
            throw new Error('username or password incorrect');
        }
        let matches = user.comparePassword(password);
        if(!matches) {
            throw new Error('username or password incorrect');
        }
        const token = jwt.sign({
            id: user.id
        }, SECRET, {
            expiresIn: '1d'
        });
        return {
            token,
            expiresIn: 1000 * 60 * 60 * 24,
            id: user.id
        }
    } catch(error) {
        return {
            error: error.message
        }
    }
}