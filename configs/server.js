'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createAddAdmin } from '../src/admins/admin.controller.js';
import { dbConnection } from './mongo.js';
import adminRoutes from '../src/admins/admin.routes.js';
import clientRoutes from '../src/clients/client.routes.js';
import companyRoutes from '../src/Companies/company.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use('/fairInterfer/v1/admins', adminRoutes);
    app.use('/fairInterfer/v1/clients', clientRoutes);
    app.use('/fairInterfer/v1/companies', companyRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexión a la base de datos exitosa');
        await createAddAdmin();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failded: ${error}`);
    }
}