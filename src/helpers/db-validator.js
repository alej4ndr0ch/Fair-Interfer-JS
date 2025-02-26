import Admin from '../admins/admin.model.js';

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