import { Config } from "../config";
import Post from "../model/post";
import User from "../model/user";
import { PostDTO, IPostDTO } from "../dto/postDTO";
import ErrorMessageDTO from "../dto/errorMessageDTO";
import { PageQuerys } from "../dto/PageDTO";
import Device from "../model/device";
import { Specificator } from "../util/specificator";
import { findAndCountAll } from "../util/services";

export class PostService {

    static async create(postDTO: IPostDTO, user: User, models?: { [name: string]: any; }, auth?: Device) {
        try {           
            return (await Post.create({
                title: postDTO.title,
                content: postDTO.content,
                likes: postDTO.likes,
                author: user,

            }, { logging: Config.Props.IsDev })).toDTO();
        } catch (err) {
            if (!(err instanceof ErrorMessageDTO))
                throw new ErrorMessageDTO({
                    title: "Error at creating post",
                    origin: "API post Create",
                    description: "server error",
                    status: 500
                })
            else {
                throw err;
            }
        }
    }

    static async getAll(querys: PageQuerys,
        user?: User | undefined,
        models?: { [name: string]: any; } | undefined, auth?: Device | undefined) {
        try {
            return await findAndCountAll<IPostDTO>(Post, querys);
        } catch (err) {
            if (err instanceof Specificator.Exception.NotMatchSpecificator) {
                throw new ErrorMessageDTO({
                    title: "Error at searching posts",
                    origin: "API post filter",
                    description: "Filter has errors",
                    errors: err,
                    status: 401
                })
            }
            Config.Props.IsDev ? console.log(err) : null;
            throw new ErrorMessageDTO({
                title: "Error at searching posts",
                origin: "API post Searching",
                description: "server error",
                status: 500
            })
        }
    }

    static async update(data: PostDTO,
        user?: User | undefined,
        models?: { [name: string]: any; } | undefined, auth?: Device | undefined) {
        try {
            if (models && models.post instanceof Post) {
                const post = models.post;
                post.title = data.title;
                post.content = data.content;
                post.likes = data.likes;

                return (await post.save({ logging: Config.Props.IsDev })).toDTO();
            }
        } catch (err) {
            throw new ErrorMessageDTO({
                title: "Error at updating posts",
                origin: "API post Update",
                description: "server error",
                status: 500
            })
        }
    }

    static async get(user?: User | undefined,
        models?: { [name: string]: any; } | undefined,
        auth?: Device | undefined) {
        try {
            if (models && models.post instanceof Post) {
                return models.post.toDTO();
            }
        } catch (err) {
            throw new ErrorMessageDTO({
                title: "Error at get posts",
                origin: "API discipline Get",
                description: "server error",
                status: 500
            })
        }
    }

    static async destroy(user: User | undefined,
        models?: { [name: string]: any; } | undefined,
        auth?: Device | undefined) {
        try {
            if (models && models.post instanceof Post) {
                const post = models.post;
                await post.destroy({ logging: Config.Props.IsDev });
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw new ErrorMessageDTO({
                title: "Error at updating posts",
                origin: "API post Update",
                description: "server error",
                status: 500
            })
        }
    }
}
