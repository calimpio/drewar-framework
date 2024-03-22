import { Hash } from "../util/hash";
import { IPostDTO, PostDTO } from "../dto/postDTO";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Optional } from "sequelize";
import { API_DB } from "../config";
import { IDaoToDTO } from "../util/services";

interface IPost {
    id: bigint;
	title: string;
	content: string;
	likes: number;

}

interface PostCreationAttributes extends Optional<IPost, "id">, Omit<IPost, "id"> { }

@Table({ tableName: "posts" })
export default class Post extends Model<IPost, PostCreationAttributes> implements IDaoToDTO<IPostDTO>, IPost {
    @PrimaryKey
    @Column
    id!: bigint;

	@Column
	title!: string;
	@Column
	content!: string;
	@Column
	likes!: number;
        

    public alterDTO(data: PostDTO) {
        data.id = Hash.encodeId(this.get('id'));       
		data.title = this.get('title');
		data.content = this.get('content');
		data.likes = this.get('likes');

        data.createdAt = this.get("createdAt");
        data.updatedAt = this.get("updatedAt");
    }

    public toDTO(): PostDTO {
        return new PostDTO(this);
    }
}

API_DB.addModels([Post])
