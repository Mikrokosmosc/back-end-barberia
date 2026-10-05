import 'dotenv/config';
import express, {json} from 'express'
import { router } from './rutas.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000;

app.use(json())
app.use(cors())

app.use('/',router)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
