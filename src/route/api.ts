import { Router } from 'express';
import { DeviceController } from '../gate/controller/deviceController';
import User from '../model/user';
import { UserController } from '../gate/controller/userController';
import { Middlewares } from './middlewares';
import { PostController } from '../gate/controller/postController';
import Post from '../model/post';



//import { Config } from '../config';
//const HashType = Config.Enum.HashTypeEnum;

// public-routes
const api = Router();
const apiPublic = Router();
api.use(apiPublic)
{
    //apiPublic.post("/init", DeviceController.init)    
}

// private-routes
const apiPrivate = Router();
api.use(apiPrivate);
apiPrivate.use(Middlewares.ApiKey())
{
    //auth-route
    const auth = Router();
    apiPrivate.use("/auth", auth);
    {
        auth.post("/", UserController.create);
        auth.post("/login", UserController.login);
    }
    // user-routes
    const user = Router();
    apiPrivate.use('/users', user);
    {
        //User-auth-routes
        const userAuth = Router();
        user.use(userAuth);
        userAuth.use(Middlewares.UserAuth());
        {
            userAuth.get("/", UserController.getAll);
            userAuth.get("/:user", Middlewares.FindById("user", User), UserController.get);
            userAuth.put("/:user", Middlewares.FindById("user", User), UserController.update);
            userAuth.delete("/:user", Middlewares.FindById("user", User), UserController.destroy);
        }
    }
    // user-routes
    const post = Router();
    apiPrivate.use('/posts', post);
    {
        //post-userAuth-routes
        const post_userAuth = Router();
        post.use(post_userAuth);
        post_userAuth.use(Middlewares.UserAuth());
        {
            post_userAuth.post("/", PostController.create);
            post_userAuth.get("/", PostController.getAll);
            post_userAuth.put("/:post", Middlewares.FindById("post", Post), PostController.update);
            post_userAuth.delete("/:post", Middlewares.FindById("post", Post), PostController.delete);
        }
    }
}


export default api;