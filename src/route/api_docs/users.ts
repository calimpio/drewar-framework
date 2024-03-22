/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Autenticacion de Usuarios
 * GET /users/{id}:
 *   get:
 *     summary: Obtener un usuario por id
 *     tags: [Users]  
 *     
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * 
 * PUT /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * 
 * DELETE /users/{id}:
 *   delete:
 *     summary: Borrar usuario por id
 *     tags: [Users]  
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *       404:
 *         description: No se pudo boorar
 *
 */