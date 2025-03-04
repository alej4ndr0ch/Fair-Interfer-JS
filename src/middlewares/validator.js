import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, existenteNameCompany } from "../helpers/db-validator.js";

export const validatorRegister = [
    body('name', 'The name is required').not().isEmpty(),
    body('surname', 'The username is required').not().isEmpty(),
    body('email', 'You must enter a valid email').isEmail(),
    body('email').custom(existenteEmail),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    validarCampos
];

export const validatorClientRegister = [
    body('name', 'The name is required').not().isEmpty(),
    body('surname', 'The username is required').not().isEmpty(),
    body('email', 'You must enter a valid email').isEmail(),
    body('email').custom(existenteEmail),
    validarCampos
];

export const validatorCompany = [
    body('name', 'The name is required').not().isEmpty(),
    body('name').custom(existenteNameCompany),
    body('authorizationLevel', 'The authorization level is required').not().isEmpty(),
    body('authorizationLevel').isIn(["bajo", "medio", "alto"]).withMessage("Only values: bajo, medio, alto are allowed"),
    body('category', 'The category is required').not().isEmpty(),
    body('foundationYear', 'The foundation year is required').not().isEmpty(),
    body('yearExperience', 'The year of experience is required').not().isEmpty(),
    validarCampos
];


export const validatorLogin = [
    body('email').optional().isEmail().withMessage('Enter a valid email address'),
    body('username').optional().isString().withMessage('Enter a valid username'),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 })
];
