import * as bcrypt from 'bcrypt';
import { User, UserModel } from "../../entity/User";
import * as jwt from 'jsonwebtoken';
import { Document, Schema } from 'mongoose';



let searchById = (id) => (value) => {
    console.log(`checking ${id} with ${value._id} and found ${value.id === id}`);
    return value._id == id
}



export async function friendInvite(user: UserModel, friendId: number) {
    const friend = await User.findById(friendId);
    let isFriend = user.friends.findIndex(searchById(friend.id)) !== -1;
    let didInvite = user.invitations.findIndex(searchById(friend.id)) !== -1;
    let isInvited = friend.invites.findIndex(searchById(user.id)) !== -1;
    if (isInvited || didInvite || isFriend) {
        console.log('error?');
        throw new Error('You are already friends or you have invited that user');
    }
    user.invitations.push(friend.id);
    friend.invites.push(user.id);
    await user.save();
    await friend.save();
    return {
        user: await user.getRelations(),
        friend: await friend.getRelations()
    }
}

export async function acceptInvite(user: UserModel, friendId: string) {
    const friend = await User.findById(friendId);
    //its important to not use triple equals here as it will not match String with ObjectId...
    let isInvited = user.invites.findIndex(searchById(friend.id));
    let didInvite = friend.invitations.findIndex(searchById(user.id));
    if(isInvited === -1 || didInvite === -1) {
        throw new Error('You are not friends with that user');
    }
    user.invites.splice(isInvited, 1);
    friend.invitations.splice(didInvite, 1);
    user.friends.push(friend.id);
    friend.friends.push(user.id);
    await Promise.all([friend.save(), user.save()]);
    await Promise.all([friend.getRelations(), user.getRelations()]);
    return {
        user,
        friend
    }
}

export async function deleteFriend(user: UserModel, friendId: string) {
    const friend = await User.findById(friendId);
    console.log('friend : ', friend);
    console.log('user : ', user);
    let userIndex = user.friends.findIndex(searchById(friend.id));
    let friendIndex = friend.friends.findIndex(searchById(user.id));
    if(userIndex === -1 || friendIndex === -1) {
        throw new Error('You are not friends with that user');
    }
    user.friends.splice(userIndex, 1);
    friend.friends.splice(friendIndex, 1);
    await Promise.all([friend.save(), user.save()]);
    await Promise.all([friend.getRelations(), user.getRelations()]);
    return {
        user,
        friend
    }    
}

export async function getDetails(id: string) {
    let user = await User.findById(id);
    await user.getRelations();
    return user;
}

export async function searchFriendByUsername(username: string, user: UserModel) {
    return await User.find({
        username: { $regex: username, $options: 'i'},
        _id: { $ne: user.id },
        friends: user.id
    }).select('_id username').exec();
}

export async function searchByUsername(username: string, user: UserModel) {
    const result = await User.find({
        username: { $regex: username, $options: 'i'},
        _id: { $ne: user.id }
    }).select('_id username').exec(); 
    return result;
};