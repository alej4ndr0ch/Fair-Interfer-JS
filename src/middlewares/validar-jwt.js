import jwt from "jsonwebtoken";
import Admin from "../admins/admin.model.js";

export const validarAdminJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(400).json({
            msg: "No hay token en la petición"
        });
    }
    
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const admin = await Admin.findById(uid);

        if (!admin) {
            return res.status(400).json({
                msg: "Token del administrado no ha sido encontrado"
            });
        }

        if (admin.estado === false) {
            return res.status(400).json({
                msg: "Token no válido - admin con estado: false"
            });
        }

        req.admin = admin;
        
        next();
        
    } catch (e) {
        
        console.log(e);
        return res.status(400).json({
            msg: "Token no válido"
        });
    }
}