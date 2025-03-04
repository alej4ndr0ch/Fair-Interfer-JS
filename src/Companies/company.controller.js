import Company from "./company.model.js";
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname } from 'path';
import path from 'path';
import { request, response } from "express";

export const addCompany = async (req, res) => {
    try {
        const data = req.body;

        if (!data.category || !data.foundationYear) {
            return res.status(400).json({
                success: false,
                message: "Error, category y foundationYear son obligatorios"
            });
        }

        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes autorización"
            });
        }

        const verifyauthorizationLevel = ["bajo", "medio", "alto"];
        const authorizationLevel = data.authorizationLevel ? data.authorizationLevel.trim().toLowerCase() : '';

        if (!verifyauthorizationLevel.includes(authorizationLevel)) {
            return res.status(400).json({
                success: false,
                message: "Error, este nivel no está autorizado, solo se permite nivel bajo, medio y alto"
            });
        }

        const company = await Company.create({
            name: data.name,
            authorizationLevel,
            foundationYear: data.foundationYear,
            description: data.description,
            category: data.category,
            createdAt: data.createdAt
        });

        res.status(200).json({
            success: true,
            message: "La compañía se ha creado correctamente",
            company: company
        });

    } catch (error) {
        console.error("Error al crear la compañía:", error);
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido crear correctamente",
            error: error.message
        });
    }
};




export const getCompanies = async (req, res) => {
    try {

        const { limite = 10, desde = 0, yearExperience, category, order } = req.query;
        const query = { estado: true };

        if (yearExperience) {
            query.yearExperience = Number(yearExperience);
        }

        if (category) {
            query.category = category.toLowerCase();
        }

        let sort = {};
        if (order === "A-Z") {
            sort.name = 1;
        } else if (order === "Z-A") {
            sort.name = -1;
        } else {
            sort.name = 1;
        }


        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "You do not have permissions to get companies"
            });
        }

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
            .sort(sort)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            companies
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting companies"
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {

        const { id } = req.params;

        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes autorizacion para listar"
            });
        }

        const company = await Company.findById(id);

        if (company.estado === false) {
            return res.status(400).json({
                success: false,
                message: "Error, la compañia no esta disponible"
            });
        }

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Error, la compañia no ha sido encontrada"
            });
        }

        res.status(200).json({
            success: true,
            company
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido traer la compañia"
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const company = await Company.findById(id);

        if (company.estado === false) {
            return res.status(400).json({
                success: false,
                message: "Error, la compañia no esta disponible"
            });
        }

        if (req.admin.role!== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "error, no tienes autorizacion para editar"
            });
        }

        const verifyImpactLevel = ["bajo", "medio", "alto"];
        if (!data.authorizationLevel || !verifyImpactLevel.includes(data.authorizationLevel.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid impact level. Accepted values are: Bajo, Medio o Alto"
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({
                success: false,
                message: "Empresa no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Empresa actualizada correctamente",
            updatedCompany
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido actualizar la empresa",
            error: error.message
        });
    }
};

export const exportCompaniesToExcel = async (req, res) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const activeCompanies = await Company.find({ estado: true });
        const inactiveCompanies = await Company.find({ estado: false });
        const companies = [...activeCompanies, ...inactiveCompanies];

        if (!activeCompanies.length && !inactiveCompanies.length) {
            return res.status(404).json({
                success: false,
                message: 'No hay empresas registradas'
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report Companies');

        worksheet.columns = [
            { header: 'ID', key: '_id', width: 30 },
            { header: 'Nombre', key: 'name', width: 25 },
            { header: 'Categoría', key: 'category', width: 20 },
            { header: 'Año de Fundación', key: 'foundationYear', width: 15 },
            { header: 'Descripción', key: 'description', width: 40 },
            { header: 'Fecha de Creación', key: 'createdAt', width: 25 }
        ];

        companies.forEach(company => {
            worksheet.addRow({
                _id: company._id.toString(),
                name: company.name,
                category: company.category,
                foundationYear: company.foundationYear,
                description: company.description || 'No disponible',
                createdAt: company.createdAt.toISOString()
            });
        });

        const reportsDir = path.join(__dirname, 'Reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        const savePath = path.join(reportsDir, 'Report Companies.xlsx');

        try {
            await fs.promises.unlink(savePath);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                return res.status(500).json({
                    success: false,
                    message: "Error updating the file, please close the file to update it",
                    error: err.message
                });
            }
        }

        await workbook.xlsx.writeFile(savePath);

        res.status(200).json({
            success: true,
            message: '¡¡Report generated successfully!!',
            filePath: savePath
        });

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            success: false,
            message: "Error generating the report",
            error: error.message || error
        });
    }
};
