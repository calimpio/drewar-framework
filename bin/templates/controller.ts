import { MakeOptions } from "../types";
export const templateController = (model: string, options: MakeOptions = {}) =>
    `import { Request, Response } from "express";
import ErrorMessageDTO, { ValidationErrorDTO } from "../../dto/errorMessageDTO";
${options.withService ?
        `import { ${model}Service } from "../../service/${model.toLowerCase()}Service";` : ""}
import { Validation } from "../../util/validation";
import { Requests } from "../requests";
${options.withValidation ?
        `import { Create${model}Validation, Update${model}Validation } from "../validation/${model.toLowerCase()
        }Validation";` : ""}

export class ${model}Controller {
    ${options.withService && options.withValidation ?
        `static async create(req: Requests.UserAuth, res: Response) {
        try {
            const validation = await Validation.validate(new Create${model}Validation(), req.body);
            const dto = await ${model}Service.create(validation.props);
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ValidationErrorDTO) {
                return res.status(400).json(new ErrorMessageDTO({ 
                    title: "creating ${model.toLowerCase()}", 
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
            const dto = await ${model}Service.getAll(req.query , req.user, req.models, req.auth);
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }

    static async update(req: Requests.UserAuth, res: Response) {
        try {
            const validation = await Validation.validate(new Update${model}Validation(), req.body);
            const dto = await ${model}Service.update(
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
                        title: "creating ${model.toLowerCase()}", 
                        origin: "api", description: "data match errors", 
                        errors: err, 
                        status: 400 
                    }))
            }
            else if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }`: ""}

    static async delete(req: Requests.UserAuth, res: Response) {
        try {           
            const dto = await ${model}Service.destroy(req.user, req.models, req.auth);
            return res.status(200).json(dto);
        } catch (err) {
            if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }
}
`