import { Connection } from "./connectionDB.js";
import bcrypt from "bcryptjs";

export class Modules {

    static validateAdmin(data, callback) {

    Connection.query(
        'SELECT id_Usuario, nombre_Usuario, contraseña FROM administrador WHERE nombre_Usuario = ?',
        [data.userName],
        (error, results) => {

            if (error) return callback(false);

            if (results.length === 0) {
                return callback(false);
            }

            bcrypt.compare(
                data.password,
                results[0].contraseña,
                (err, match) => {

                    if (err) return callback(false);

                    if (match) {

                        callback({
                            id: results[0].id_Usuario,
                            userName: results[0].nombre_Usuario,
                            rol: "Administrador"
                        });

                    } else {

                        callback(false);
                    }
                }
            );
        }
    );
}


    static validateClient(data, callback) {

    Connection.query(
        'SELECT id_Cliente, nombre, contraseña FROM cliente WHERE nombre = ?',
        [data.userName],
        (error, results) => {

            if (error) return callback(false);

            if (results.length === 0) {
                return callback("Usuario no registrado");
            }


            bcrypt.compare(
                data.password,
                results[0].contraseña,
                (err, match) => {

                    console.log("ERROR BCRYPT:", err);
                    console.log("MATCH:", match);

                    if (err) return callback(false);

                    if (match) {

                        callback({
                            id: results[0].id_Cliente,
                            userName: results[0].nombre,
                            rol: "Cliente"
                        });

                    } else {

                        callback(false);

                    }
                }
            );
        }
    );
}

    static registerUser(data, callback) {

        bcrypt.hash(data.password, 10, (err, hash) => {

            if (err) {
                return callback("Error al registrar el usuario");
            }

            Connection.query(
                'INSERT into cliente(nombre, id_Rol, telefono, contraseña) values(?,?,?,?)',
                [data.userName, 3, data.phone, hash],
                (error, results) => {

                    if (error) {
                        return callback("Error al registrar el usuario");
                    }

                    callback("Registro exitoso");

                }
            );

        });

    }


    static saveBarberos(data, callback) {

        const values = data.map(b => [
            2,
            b.nombre,
            b.apellido,
            b.especialidad,
            b.estado
        ]);

        const sql = `
            INSERT INTO barbero (id_Rol, nombre, apellido, especialidad, estado)
            VALUES ?
        `;

        Connection.query(sql, [values], (error, results) => {
            if (error) throw error;
            callback("Barberos guardados correctamente");
        });
    }

    static getBarberos(callback) {

        Connection.query('SELECT * FROM barbero', (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    static deleteBarbero(id, callback) {

        Connection.query('DELETE FROM barbero WHERE id = ?', [id], (error, results) => {
            if (error) throw error;
            callback("Barbero eliminado");
        });
    }

    static saveServicio(data, callback) {

        const sql = `
            INSERT INTO servicio (nombre, duracion, precio, tipo_Servicio)
            VALUES ?
        `;

        Connection.query(sql, [data], (error, results) => {
            if (error) throw error;
            callback("Servicios guardados correctamente");
        });
    }

    static getServicio(callback) {

        Connection.query('SELECT * FROM servicio', (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    static deleteServicio(id, callback) {

    Connection.query(
        'DELETE FROM servicio WHERE id = ?',
        [id],
        (error, results) => {

            if (error) {

                if (error.code === "ER_ROW_IS_REFERENCED_2") {
                    return callback(
                        "No se puede eliminar este servicio porque tiene citas asociadas."
                    );
                }

                return callback(
                    "Error al eliminar el servicio."
                );
            }

            callback("Servicio eliminado");
        }
    );
}

    static getServiciosPorTipo(tipo, callback) {
        Connection.query(
            'SELECT * FROM servicio WHERE tipo_Servicio = ?',
            [tipo],
            (error, results) => {
                if (error) throw error;
                callback(results);
            }
        );
    }

    static crearCita(data, callback) {

        // INC-001: se valida que la franja (fecha + hora) no esté ya reservada
        // antes de insertar, para evitar dobles reservas en el mismo horario.
        Connection.query(
            'SELECT id FROM cita WHERE fecha = ? AND hora = ?',
            [data.fecha, data.hora],
            (errorConsulta, existentes) => {

                if (errorConsulta) {
                    return callback({
                        ok: false,
                        message: "Error al validar la disponibilidad del horario"
                    });
                }

                if (existentes.length > 0) {
                    return callback({
                        ok: false,
                        message: "El horario seleccionado ya está reservado. Por favor elija otra hora."
                    });
                }

                Connection.query(
                    'INSERT INTO cita (id_Cliente, id_Servicio, fecha, hora) VALUES (?, ?, ?, ?)',
                    [data.id_Cliente, data.id_Servicio, data.fecha, data.hora],
                    (error, results) => {

                        if (error) {

                            // Respaldo: si la restricción UNIQUE de la base de datos
                            // rechaza el registro, se informa el mismo mensaje al cliente.
                            if (error.code === 'ER_DUP_ENTRY') {
                                return callback({
                                    ok: false,
                                    message: "El horario seleccionado ya está reservado. Por favor elija otra hora."
                                });
                            }

                            return callback({
                                ok: false,
                                message: "No se pudo crear la cita"
                            });
                        }

                        callback({
                            ok: true,
                            id: results.insertId,
                            message: "Cita creada"
                        });
                    }
                );

            }
        );
    }

    static getCitas(callback) {

        const sql = `
            SELECT
                cita.id,
                cita.id_Cliente,
                cita.fecha,
                cita.hora,
                cita.id_Cliente,
                cliente.nombre AS nombreCliente,
                servicio.nombre AS nombreServicio,
                servicio.precio,
                servicio.tipo_Servicio,
                barbero.nombre AS nombreBarbero,
                barbero.apellido AS apellidoBarbero
            FROM cita
            JOIN servicio ON cita.id_Servicio = servicio.id
            JOIN cliente ON cita.id_Cliente = cliente.id_Cliente
            LEFT JOIN barbero ON cita.id_Barbero = barbero.id
            ORDER BY cita.fecha DESC, cita.hora DESC
        `;

        Connection.query(sql, (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    static getCitasPorCliente(id, callback) {

        const sql = `
            SELECT
                cita.id,
                cita.fecha,
                cita.hora,
                servicio.nombre AS nombreServicio,
                servicio.precio,
                servicio.tipo_Servicio
            FROM cita
            JOIN servicio ON cita.id_Servicio = servicio.id
            WHERE cita.id_Cliente = ?
            ORDER BY cita.fecha DESC, cita.hora DESC
        `;

        Connection.query(sql, [id], (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    static getCitasPorFecha(fecha, callback) {

        Connection.query(
            'SELECT hora FROM cita WHERE fecha = ?',
            [fecha],
            (error, results) => {
                if (error) throw error;
                callback(results);
            }
        );
    }

    static deleteCita(id, callback){

        Connection.query(
            "DELETE FROM cita WHERE id = ?",
            [id],
            (err)=>{
                if(err) throw err;
                callback("deleted");
            }
        );
    }

    static getEstadisticas(callback) {

        const sql = `
            SELECT
                MONTH(cita.fecha) AS mes,
                COUNT(*) AS totalReservas,
                SUM(servicio.precio) AS ingresos
            FROM cita
            JOIN servicio ON cita.id_Servicio = servicio.id
            WHERE YEAR(cita.fecha) = YEAR(CURDATE())
            GROUP BY MONTH(cita.fecha)
            ORDER BY mes
        `;

        Connection.query(sql, (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }


    static getResumen(callback) {

        Connection.query(
            'SELECT COUNT(*) AS citasHoy FROM cita WHERE fecha = CURDATE()',
            (error, citasHoyResult) => {

                if (error) throw error;

                Connection.query(
                    'SELECT COUNT(*) AS totalClientes FROM cliente',
                    (error2, clientesResult) => {

                        if (error2) throw error2;

                        // INC-002: COALESCE evita que SUM devuelva NULL cuando no hay
                        // citas en el periodo, y CAST garantiza un valor numérico
                        // (mysql2 devuelve DECIMAL como cadena de texto).
                        Connection.query(
                            `SELECT COALESCE(SUM(servicio.precio), 0) AS ingresosMes
                             FROM cita
                             JOIN servicio ON cita.id_Servicio = servicio.id
                             WHERE MONTH(cita.fecha) = MONTH(CURDATE())
                               AND YEAR(cita.fecha) = YEAR(CURDATE())`,
                            (error3, ingresosResult) => {

                                if (error3) throw error3;

                                callback({
                                    citasHoy: Number(citasHoyResult[0].citasHoy) || 0,
                                    totalClientes: Number(clientesResult[0].totalClientes) || 0,
                                    ingresosMes: Number(ingresosResult[0].ingresosMes) || 0
                                });

                            }
                        );

                    }
                );

            }
        );

    }

}