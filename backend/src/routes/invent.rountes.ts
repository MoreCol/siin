import { Router } from 'express'

import {
    getInventarios,
    getInvent,
    createInvent,
    updateInvent,
    deleteInvent,
} from "../controllers/invent.controllers"

const router = Router()

router.get ('/inventario',getInventarios);
router.get ('/inventario/:id',getInvent);
router.post ('/inventario',createInvent);
router.put ('/inventario/:id',updateInvent);
router.delete ('/inventario/:id',deleteInvent);

export default router

