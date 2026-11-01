import { Modules } from './modules.js'

export class Controller{

    static validateAdmin(req, res){
        const data = req.body
        const newData = {
            userName: data.userName,
            password: data.password  
        }

        Modules.validateAdmin(newData, callback=>{
            res.json(callback)
        })
    }

    static validateClient(req, res){
        const data = req.body
        const newData = {
            userName: data.userName,
            password: data.password  
        }

        Modules.validateClient(newData, callback=>{
            res.json(callback)
        })
    }

    static registerUser(req, res){

        const data = req.body
        const newData = {
            userName: data.userName,
            phone: data.phone,
            password: data.password
        }

        Modules.registerUser(newData, callback=>{
            res.json(callback)
        })

    }

    static saveBarberos(req, res) {

        const data = req.body;

        Modules.saveBarberos(data, (callback) => {
            res.json(callback);
        });
    }

    static getBarberos(req, res) {

        Modules.getBarberos((callback) => {
            res.json(callback);
        });
    }

    static deleteBarbero(req, res) {   

    const id = req.params.id;

    Modules.deleteBarbero(id, (callback) => {
        res.json(callback);
    });
    }

    static saveServicio(req, res) {

        const data = req.body;

        const newData = data.map(s => [
            s.nombre,
            s.duracion,
            s.precio,
            s.tipoServicio
        ]);

        Modules.saveServicio(newData, (callback) => {
            res.json(callback);
        });
    }

    static getServicio(req, res) {

        Modules.getServicio((callback) => {
            res.json(callback);
        });
    }

    static deleteServicio(req, res) {

        const id = req.params.id;

        Modules.deleteServicio(id, (callback) => {
            res.json(callback);
        });
    }

    static getServiciosPorTipo(req, res) {

    const tipo = req.params.tipo;

    Modules.getServiciosPorTipo(tipo, callback => {
        res.json(callback);
    });
    }

    static crearCita(req, res) {

        const data = req.body;

        Modules.crearCita(data, (resultado) => {

            // INC-001: si la franja ya está ocupada se responde 409 (conflicto),
            // para que el frontend pueda mostrar el mensaje de error al cliente.
            if (!resultado.ok) {
                return res.status(409).json(resultado);
            }

            res.status(201).json(resultado);
        });
    }

    static getCitas(req, res) {

        Modules.getCitas((callback) => {
            res.json(callback);
        });
    }

    static getCitasPorCliente(req, res) {

        const id = req.params.id;

        Modules.getCitasPorCliente(id, (callback) => {
            res.json(callback);
        });
    }

    static getCitasPorFecha(req, res) {

        const fecha = req.params.fecha;

        Modules.getCitasPorFecha(fecha, (callback) => {
            res.json(callback);
        });
    }

    static deleteCita(req, res){
        const id = req.params.id;

        Modules.deleteCita(id, (r)=>{
            res.json(r);
        });
    }

    static getEstadisticas(req, res) {

        Modules.getEstadisticas((callback) => {
            res.json(callback);
        });
    }

    static getResumen(req, res) {

        Modules.getResumen((callback) => {
            res.json(callback);
        });
    }

}
//controller