import Admin from './admin.model.js'
import { hash, verify } from 'argon2'
import { generateJWT } from '../helpers/generate-jwt.js'
import { response, request } from 'express'

export const login = async (req, res) => {

    const { email, password, username } = req.body

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const admin = await Admin.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!admin) {
            return res.status(404).json({
                msg: 'Credenciales incorrectas, correo no existe en la base de datos'
            })
        }

        if (!admin.estado) {
            return res.status(404).json({
                msg: 'El adminstrador no existe en la base de datos'
            })
        }

        const validPassword = await verify(admin.password, password);

        if (!validPassword) {
            return res.status(404).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(admin.id);

        res.status(200).json({
            msg: 'Inicio de sesion con exito',
            userDetails: {
                username: user.username,
                token: token
            }
        })

    } catch (e) {
        
        console.error(e);

        return res.status(500).json({
            msg: 'Admin registration failded',
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        
        const data = req.body;

        const encryptedPassword = await hash(data.password);
        
        const admin = await Admin.create({
            name: data.name,
            surname: data.surname,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: encryptedPassword
        })

        res.status(200).json({
            msg: 'Admin registered successfully',
            userDetails: {
                username: user.username
            }
        })

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            msg: 'Admin registration failded',
            error: error.message
        })
    }
}

export const getAdmins = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [total, admins] = await Promise.all([
            Admin.countDocuments(query),
            Admin.find(query)
           .skip(Number(desde))
           .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            admins
        })
    
    } catch (error) {

        res.status(500).json({
            success: false,
            msg: 'Error al obtener los administradores',
            error
        })       
    }
}

export const getAdminById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const admin = await Admin.findById(id);

        if (admin.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Error, este administrador buscado no esta disponible'
            })
        }

        if (!admin) {
            return res.status(404).json({
                success: false,
                msg: 'Error, admin no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            admin
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error, el administrador no ha sido encontrado',
            error
        })
    }
}

export const updateAdmins = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const { _id, email, role, password, currentPassword, ...data } = req.body;
        let { username } = req.body;

        if (username) {
            username = username.toLowerCase();
            data.username = username;
        }

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(400).json({
                success: false,
                msg: 'Error, admin no encontrado'
            })
        }

        if (admin.estado === false) {
            return res.status(400).json({
                success: false,
                msg: 'Error, Este admin no esta disponible'
            })
        }

        if (req.admin.id !== id) {
            return res.status(400).json({
                success: false,
                msg: 'Error, permiso denegado para actualizar un perfil que no es suyo'
            })
        }

        if (password) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error, la contraseña no es la correcta'
                })
            }
            
            const verifyPassword = await verify(admin.password, currentPassword);
            
            if (!verifyPassword) {
                return res.status(400).json({
                    success: false,
                    msg: 'Contraseña actual incorrecta'
                })
            }

            data.password = await hash(password);
        }


        const updateAdmin = await Admin.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "El admin se ha actualizado",
            updateAdmin
        })

    } catch (error) {
        
        res.status(500).json({
            success: false,
            msg: 'Error, no se ha podido actualizar el usuario',
            error
        })
    }
}

export const deleteAdmins = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        
        if(!password) {
            return res.status(400).json({
                success: false,
                msg: 'Error, la contraseña es obligatoria para desactivar un usuario'
            });
        }
        
        const admin = await Admin.findByIdAndUpdate(id, { estado: false }, { new: true });
        const authenticatedAdmin = req.user;

        return res.status(200).json({
            success: true,
            msg: 'Usuario desactivado',
            admin,
            authenticatedAdmin
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al desactivar administrador',
            error
        });
    }
};


export const createAddAdmin = async () => {
    try {

        const verifyAdmin = await Admin.findOne({ username: "Administrador".toLowerCase() })

        if (!verifyAdmin) {
            const encryptedPassword = await hash("Admin100");
            const adminUser = new User({
                name: "Alejandro",
                surname: "Cuxún",
                username: "Administrador".toLowerCase(),
                email: "alejandrocuxun@gmail.com",
                phone: "42217005",
                password: encryptedPassword,
                role: "ADMIN"
            });
    
            await adminUser.save();
    
            console.log("Administrador creado exitosamente");
        } else {
            console.log("Administrado se ha creado exitosamente");
        }

    
    } catch (error) {
        console.error("Error, no se ha podido crear el administrado: ", 
        error
    );
    }
}