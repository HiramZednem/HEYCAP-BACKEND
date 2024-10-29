import { prisma } from "../db/db";
import { userService } from "./user.service";



export class followService {
    constructor() { }

    public async follow(id_user: number, id_followed: number) {
        
        const isFollowing = await this.isFollowing(id_user, id_followed);
        if (isFollowing) {
            throw new Error("You are already following this user");
        }

        const follow = await prisma.follows.create({
            data: {
                user_id: id_user,
                follow_id: id_followed
            }
        })

        return follow;
    }

    public async unfollow(id_user: number, id_followed: number) {
        const isFollowing = await this.isFollowing(id_user, id_followed);
        if (!isFollowing) {
            throw new Error("You are not following this user");
        }

        await prisma.follows.delete({
            where: {
            user_id_follow_id: {
                user_id: id_user,
                follow_id: id_followed
            }
            }
        })
    }

    public async getFollowers(id_user: number) {
        const followers = await prisma.follows.findMany({
            where: {
                user_id: id_user
            }
        })

        // los follow_id los tengo que transformar a tipo user
        const followersParsed = await Promise.all(followers.map(async (follow) => {
            const user = await userService.getUserByIdUser(follow.follow_id);
            return user;
        }));
        return followersParsed;
    }

    public async isFollowing(id_user: number, id_followed: number) {
        const follow = await prisma.follows.findFirst({
            where: {
                user_id: id_user,
                AND: {
                    follow_id: id_followed
                }
            }
        })
        return !!follow;
    }

}