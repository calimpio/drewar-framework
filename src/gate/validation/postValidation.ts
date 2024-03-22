import { PostDTO } from "../../dto/postDTO";
import { IValidable, ValidaterMap, ValidationTypes } from "../../util/validation";


export class CreatePostValidation implements IValidable<PostDTO>{
    validations:ValidaterMap<PostDTO> = {
		title: {
			type: ValidationTypes.string
		},
		content: {
			type: ValidationTypes.string
		},
		likes: {
			type: ValidationTypes.number
		},

    }
    props!: PostDTO;

}

export class UpdatePostValidation implements IValidable<PostDTO>{
    validations: ValidaterMap<PostDTO> = {
		title: {
			type: ValidationTypes.string
		},
		content: {
			type: ValidationTypes.string
		},
		likes: {
			type: ValidationTypes.number
		},		
    }
    props!: PostDTO;

}
