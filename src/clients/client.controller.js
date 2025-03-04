import Client from "./client.model.js";
import { request, response } from "express";

export const addClient = async (req, res) => {
    try {
        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes permiso para crear el cliente"
            });
        }

        const data = req.body;

        const client = await Client.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone,
            address: data.address
        });

        res.status(200).json({
            success: true,
            message: "Cliente ha sido creado con éxito",
            client
        });

    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido crear el cliente"
        });
    }
};


export const getClients = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes autorización para listar"
            });
        }

        const [total, clients] = await Promise.all([
            Client.countDocuments(query),
            Client.find(query)
            .skip(desde)
            .limit(parseInt(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            clients
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido encontrar los clientes"
        });
    }
}

export const getClientById = async (req, res) => {
    try {

        const { id } = req.params;

        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes la autorización para buscar a los clientes"
            });
        }

        const client = await Client.findById(id);

        if (client.estado === false) {
            return res.status(400).json({
                success: false,
                message: "El cliente no esta disponible"
            });
        }
        
        if (!client) {
            return res.status(400).json({
                success: false,
                message: "El cliente no ha sido encontrado"
            });
        }

        res.status(200).json({
            success: true,
            client
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido traer al cliente por el ID"
        });
    }
}

export const updateClient = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, email, ...data } = req.body;

        const client = await Client.findById(id);
        
        if (client.estado === false) {
            return res.status(400).json({
                success: false,
                message: "El cliente no esta disponible"
            });
        }
        
        if (!client) {
            return res.status(400).json({
                success: false,
                message: "El cliente no ha sido encontrado"
            });
        }

        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes autorización para editar al cliente"
            });
        }

        const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: "El cliente ha sido editado éxitosamente",
            updatedClient
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido editar a los clientes"
        });
    }
}

export const deleteClient = async (req, res = response) => {
    try {

        const { id } = req.params;
        
        const client = await Client.findById(id);

        if (client.estado === false) {
            return res.status(400).json({
                success: false,
                message: "El cliente no esta disponible"
            });
        }

        if (!client) {
            return res.status(400).json({
                success: false,
                message: "El cliente no ha sido encontrado"
            });
        }
        
        if (req.admin.role !== "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Error, no tienes autorización para eliminar al cliente"
            });
        }

        const deleteClient = await Client.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            message: "El cliente se ha eliminado exitosamente",
            deleteClient
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error, no se ha podido eliminar al cliente"
        });
    }
}