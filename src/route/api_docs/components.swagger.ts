/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - name
 *         - lname
 *         - password
 *         - passwordConfirm
 *       properties:
 *         id:
 *           type: string
 *           description: Llave primaria del usuario
 *         email:
 *           type: string
 *           description: Correo del usuario
 *         username:
 *           type: string
 *           description: Nickname del usuario
 *         name:
 *           type: string
 *           description: Nombres del usuario
 *         lname:
 *           type: string
 *           description: Apellidos del usuario
 *         role:
 *           type: string
 *           description: Rol del usuario
 *         token:
 *           type: string
 *           description: The user author
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Fecha de creacion
 *         updateAt:
 *           type: string
 *           format: date
 *           description: Fecha de creacion
 *       example:
 *         id: d5fE_asz
 *         username: The New Turing Omnibus
 *         name: Alexander 
 *         lname: K. Dewdney
 *         createdAt: 2020-03-10T04:05:06.157Z        
 *     
 *     UserLogin:
 *       type: object
 *       required:         
 *         - username         
 *         - password         
 *       properties:         
 *         email:
 *           type: string
 *           description: Correo del usuario
 *         username:
 *           type: string
 *           description: Nickname del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario        
 *       example:        
 *         username: The New Turing Omnibus
 *         password: qwe123456         
 * 
 *          
 *     UpdateUser:
 *       type: object               
 *       properties:         
 *         passwords:
 *           type: object              
 *           description: Cambiar contraseña
 *           properties: 
 *             oldPassword:
 *               type: string
 *               description: Contraseña actual
 *             newPassword:
 *               type: string
 *               description: Nueva contraseña 
 *         name:
 *           type: string
 *           description: Nombres de usuario 
 *         email:
 *           type: string
 *           description: Correo del usuario  
 *         lname:
 *           type: string
 *           description: Apellidos del usuario          
 *       example:
 *         id: d5fE_asz
 *         username: The New Turing Omnibus
 *         name: Alexander 
 *         lname: K. Dewdney
 *         createdAt: 2020-03-10T04:05:06.157Z
 *     
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content        
 *       properties:
 *         id:
 *           type: string
 *           description: Llave primaria del post
 *         title:
 *           type: string
 *           description: Titulo del post
 *         content:
 *           type: string
 *           description: Contenido del post
 *         likes:
 *           type: number
 *           description: Me gustan del post        
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Fecha de creacion
 *         updateAt:
 *           type: string
 *           format: date
 *           description: Fecha de creacion
 *       example:
 *         id: d5fE_asz
 *         title: My new Post!
 *         content: Lorem in sup.
 *         likes: 0
 * 
 *      
 *          
 */