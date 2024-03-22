/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Autenticacion de Usuarios
 * 
 * 
 * GET /posts:
 *   get:
 *     summary: Obtener varios y bucar post por id
 *     tags: [Posts]      
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 * 
 * PUT /posts/{id}:
 *   put:
 *     summary: Actualizar post por id
 *     tags: [Posts]     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 * 
 * DELETE /posts/{id}:
 *   delete:
 *     summary: Borrar post por id
 *     tags: [Posts]  
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 *       404:
 *         description: No se pudo boorar
 *
 */