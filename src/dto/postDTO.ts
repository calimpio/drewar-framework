import { IDaoToDTO } from "../util/services";
export interface IPostDTO {
    id: string;
	title: string;
	content: string;
	likes: number;

    createdAt?: string;
    updatedAt?: string;
}

export class PostDTO implements IPostDTO {
    id!: string;
	title!: string;
	content!: string;
	likes!: number;

    createdAt?: string;
    updatedAt?: string;
    constructor(data: IDaoToDTO<IPostDTO> | IPostDTO) {
        if (data) {
            const dao = (data as IDaoToDTO<IPostDTO>);
            const dto = (data as IPostDTO);
            if (typeof dao.alterDTO == "function")
                dao.alterDTO(this)
            else {
                this.id = dto.id;
				this.title = dto.title;
				this.content = dto.content;
				this.likes = dto.likes;

                this.createdAt = dto.createdAt;
                this.updatedAt = dto.updatedAt;
            }
        }
    }
}
