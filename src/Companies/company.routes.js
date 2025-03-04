import { Router } from 'express';
import { check } from "express-validator";
import { addCompany, getCompanies, getCompanyById, updateCompany, exportCompaniesToExcel } from '../Companies/company.controller.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarAdminJWT } from '../middlewares/validar-jwt.js';
import { validatorCompany  } from '../middlewares/validator.js';
import { existenteCompanyById } from '../helpers/db-validator.js';

const router = Router();

router.post(
    '/',
    [
        validarAdminJWT,
        validatorCompany,
        validarCampos
    ],
    addCompany
);

router.get(
    '/', 
    validarAdminJWT, 
    getCompanies
);

router.get(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'Invalid ID').isMongoId(),
        check('id').custom(existenteCompanyById),
        validarCampos
    ],
    getCompanyById
);

router.put(
    '/:id',
    [
        validarAdminJWT,
        check('id', 'Invalid ID').isMongoId(),
        check('id').custom(existenteCompanyById),
        validatorCompany,
        validarCampos
    ],
    updateCompany
);

router.get('/export/excel', exportCompaniesToExcel);


export default router;
