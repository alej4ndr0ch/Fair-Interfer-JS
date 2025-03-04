import { Router } from "express";
import { check } from "express-validator";
import { existeAdminById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarAdminJWT } from "../middlewares/validar-jwt.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { login, register, getAdmins, getAdminById, updateAdmins, deleteAdmins } from "./admin.controller.js";
import { validatorRegister, validatorLogin } from "../middlewares/validator.js";

const router = Router();

router.post(
    '/login',
    validatorLogin,
    deleteFileOnError,
    login
);

router.post(
    '/register',
    validatorRegister,
    deleteFileOnError,
    register
);

router.get(
    '/',
    getAdmins
);

router.get(
    '/:id',
    [
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeAdminById),
        validarCampos
    ],
    getAdminById
);

router.put(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeAdminById),
        validarCampos
    ],
    updateAdmins
);

router.delete(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeAdminById),
        validarCampos,
    ],
    deleteAdmins
);

export default router;