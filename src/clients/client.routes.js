import { Router } from "express";
import { check } from "express-validator";
import { existeClienteById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarAdminJWT } from "../middlewares/validar-jwt.js";
import { addClient, getClients, getClientById, updateClient, deleteClient } from "./client.controller.js";
import { validatorClientRegister } from "../middlewares/validator.js";

const router = Router();

router.post(
    '/',
    [
        validarAdminJWT,
        validatorClientRegister,
        validarCampos
    ],
    addClient
);

router.get(
    '/',
    validarAdminJWT,
    getClients
);

router.get(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'Invalid ID').isMongoId(),
        check('id').custom(existeClienteById),
        validarCampos
    ],
    getClientById
);

router.put(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'Invalid ID').isMongoId(),
        check('id').custom(existeClienteById),
        validarCampos
    ],
    updateClient
);

router.delete(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'Invalid ID').isMongoId(),
        check('id').custom(existeClienteById),
        validarCampos
    ],
    deleteClient
);

export default router;