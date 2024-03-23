import { Request, Response } from "express";
import ErrorMessageDTO, { ValidationErrorDTO } from "../../dto/errorMessageDTO";
import { PostService } from "../../service/postService";
import { Validation } from "../../util/validation";
import { Requests } from "../requests";
import { CreatePostValidation, UpdatePostValidation } from "../validation/postValidation";

export class PostController {
    static async create(req: Requests.UserAuth, res: Response) {
        try {
            const validation = await Validation.validate(new CreatePostValidation(), req.body);
            const dto = await PostService.create(validation.props, req.user);
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ValidationErrorDTO) {
                return res.status(400).json(new ErrorMessageDTO({
                    title: "creating post",
                    origin: "api",
                    description: "data match errors",
                    errors: err, status: 400
                }))
            }
            else if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }

    static async getAll(req: Requests.GetAll, res: Response) {
        try {
            const dto = await PostService.getAll(req.query, req.user, req.models, req.auth);
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }

    static async update(req: Requests.UserAuth, res: Response) {
        try {
            const validation = await Validation.validate(new UpdatePostValidation(), req.body);
            const dto = await PostService.update(
                validation.props,
                req.user,
                req.models,
                req.auth
            );
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ValidationErrorDTO) {
                return res.status(400).json(
                    new ErrorMessageDTO({
                        title: "creating post",
                        origin: "api", description: "data match errors",
                        errors: err,
                        status: 400
                    }))
            }
            else if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }

    static async delete(req: Requests.UserAuth, res: Response) {
        try {
            const dto = await PostService.destroy(req.user, req.models, req.auth);
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }
}
