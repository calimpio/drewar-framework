import {Router } from 'express';
import User from '../model/user';
import { UserController } from '../gate/controller/userController';
import { Middlewares } from './middlewares';
import { PostController } from '../gate/controller/postController';
import Post from '../model/post';
import { Routers } from './routers';
import { Requests } from '../gate/requests';



// API
const api = Router();

//Public-API
Routers.createApp(api, (apiPublic) => {
    //apiPublic.post("/init", DeviceController.init)    
});


//Private-API
Routers.createGroup(api, [Middlewares.ApiKey()], (apiPrivate) => {
    Routers.createPath<Requests.ModelFinder>(apiPrivate, "/auth", (auth) => {
        auth.post("/", UserController.create);
        auth.post("/login", UserController.login);
    });
    Routers.createGroup(apiPrivate, [Middlewares.UserAuth()], (userAuth) => {
        Routers.createPath<Requests.UserAuth>(userAuth, "/users", (users) => {
            users.get("/", UserController.getAll);
            users.get("/:user", Middlewares.FindById("user", User), UserController.get);
            users.put("/:user", Middlewares.FindById("user", User), UserController.update);
            users.delete("/:user", Middlewares.FindById("user", User), UserController.destroy);
        });

        Routers.createPath<Requests.UserAuth>(userAuth, "/posts", (posts) => {
            posts.post("/", PostController.create);
            posts.get("/", PostController.getAll);
            posts.put("/:post", Middlewares.FindById("post", Post), PostController.update);
            posts.delete("/:post", Middlewares.FindById("post", Post), PostController.delete);
        });
    });
});

export default api;