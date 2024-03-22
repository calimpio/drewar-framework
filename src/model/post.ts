import { Hash } from "../util/hash";
import { IPostDTO, PostDTO } from "../dto/postDTO";
import { Column, Model, PrimaryKey, Table, HasMany, HasOne, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { Optional } from "sequelize";
import { API_DB } from "../config";
import { IDaoToDTO } from "../util/services";
import User from "./user";
import { UserDTO } from "src/dto/userDTO";

interface IPost {
    id: string;
	title: string;
	content: string;
	likes: number;
    author: User

}

interface PostCreationAttributes extends Optional<IPost, "id">, Omit<IPost, "id"> { }

@Table({ tableName: "posts" })
export default class Post extends Model<IPost, PostCreationAttributes> implements IDaoToDTO<IPostDTO>, IPost {
    @PrimaryKey
    @Column
    id!: string;

	@Column
	title!: string;

	@Column
	content!: string;

	@Column
	likes!: number;
        
    @BelongsTo(()=>User, {foreignKey: "author_id"})
    author!: User


    public alterDTO(data: PostDTO) {
        data.id = this.get('id');       
		data.title = this.get('title');
		data.content = this.get('content');
		data.likes = this.get('likes');
        data.author = this.get('author').toDTO();
        data.createdAt = this.get("createdAt");
        data.updatedAt = this.get("updatedAt");
    }

    public toDTO(): PostDTO {
        return new PostDTO(this);
    }
}

API_DB.addModels([Post])
