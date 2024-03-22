const { DataTypes } = require("sequelize");

module.exports = {
    Posts: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,            
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },        
        likes: {
            type: DataTypes.BIGINT(11),
            allowNull: false,            
        },
        author_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:{
                    tableName: "users"
                },
                key: "id"
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: false,
            defaultValue: DataTypes.NOW,
            type: DataTypes.DATE
        },
    }
}