import { HashTypeEnum } from "../../config";
import { IValidable, ValidaterMap, ValidationTypes } from "../../util/validation";
import { INewUserRequestBody, IUserLoginBody, IUserUpdateBody } from "../../dto/userDTO";
import User from "../../model/user";


export class CreateUserValidation implements IValidable<INewUserRequestBody> {

    public validations: ValidaterMap<INewUserRequestBody> = {
        email: {
            type: ValidationTypes.email,
            required: true,
        },
        username: {
            type: ValidationTypes.string,
            required: true,
            unique: () => ({
                column: "username",
                model: User
            })
        },
        name: {
            type: ValidationTypes.string,
            required: true,
        },
        lname: {
            type: ValidationTypes.string,
            required: true,
        },
        password: {
            type: ValidationTypes.string,
            required: true,
            confirm: true,
            encode: HashTypeEnum.Password,
        },
        passwordConfirm: {
            type: ValidationTypes.string,
            required: true,
        }
    }

    public props!: INewUserRequestBody
}



export class UserLoginValidation implements IValidable<IUserLoginBody>{
    validations: ValidaterMap<IUserLoginBody> = {
        username: {
            type: ValidationTypes.string,
            required: true,
        },
        password: {
            type: ValidationTypes.string,
            required: true,
            encode: HashTypeEnum.Password
        }
    }
    props!: IUserLoginBody;
}


export class UpdateUserValidation implements IValidable<IUserUpdateBody>{
    validations: ValidaterMap<IUserUpdateBody> = {
        passwords: {
            type: ValidationTypes.object,
            requiredIf: {
                condition: {
                    field: "isPasswordWillChange",
                    value: true,
                },
                then: {
                    oldPassword: {
                        type: ValidationTypes.string,
                        required: true,
                        encode: HashTypeEnum.Password,
                    },
                    newPassword: {
                        type: ValidationTypes.string,
                        required: true,
                        encode: HashTypeEnum.Password,
                    }
                }
            }
        },
        email: {
            type: ValidationTypes.email
        },
        name: {
            type: ValidationTypes.string
        },
        lname: {
            type: ValidationTypes.string
        },
        role: {
            type: ValidationTypes.number
        },
    }

    props!: IUserUpdateBody;

}