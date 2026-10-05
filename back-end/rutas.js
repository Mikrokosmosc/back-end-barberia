import express from 'express'
import { Controller } from './controller.js'

export const router = express.Router()

router.post('/validateAdmin', Controller.validateAdmin)
router.post('/validateClient', Controller.validateClient)
router.post('/registerUser', Controller.registerUser)

router.post('/saveBarberos', Controller.saveBarberos)
router.get('/getBarberos', Controller.getBarberos)
router.delete('/deleteBarbero/:id', Controller.deleteBarbero)

router.post('/saveServicios', Controller.saveServicio)
router.get('/getServicios', Controller.getServicio)
router.delete('/deleteServicio/:id', Controller.deleteServicio)

router.get('/getServiciosPorTipo/:tipo', Controller.getServiciosPorTipo)

router.post('/crearCita', Controller.crearCita)
router.get('/getCitas', Controller.getCitas)
router.get('/getCitasPorCliente/:id', Controller.getCitasPorCliente)
router.get('/getCitasPorFecha/:fecha', Controller.getCitasPorFecha)
router.delete('/deleteCita/:id', Controller.deleteCita)

router.get('/getEstadisticas', Controller.getEstadisticas)
router.get('/getResumen', Controller.getResumen)
