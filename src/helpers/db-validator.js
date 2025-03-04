import Admin from '../admins/admin.model.js';
import Client from '../clients/client.model.js';
import Company from '../Companies/company.model.js';

export const existenteEmail = async (correo = ' ') => {

    const existeEmail = await Admin.findOne({ correo });

    if(existeEmail){
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
}

export const existeAdminById = async (id = '') => {
    
    const existeAdmin = await Admin.findById(id);
    console.log(existeAdmin)
    if(!existeAdmin){
        throw new Error(`El ID ${id} no existe`);
    }
    console.log("error")
}

export const existeClienteById = async (id = '') => {
    
    const existeClient = await Client.findById(id);
    console.log(existeClient)
    if(!existeClient){
        throw new Error(`El ID ${id} no existe`);
    }
    console.log("error")
}

export const existenteCompanyById = async (id = '') => {

    const existeCompany = await Company.findById(id);

    if (!existeCompany) {
        throw new Error(`The ID ${ id } does not exist in the database`);
    }
}

export const existenteNameCompany = async (name = '') => {
    const existeName = await Company.findOne({ name });

    if (existeName) {
        throw new Error(`The name "${name}" already exists in the database`);
    }
};