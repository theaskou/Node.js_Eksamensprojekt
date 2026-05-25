import { Router } from "express";

const router = Router();

router.get("/lists", (req, res) => {

    res.send( { data: lists } )
});


export default router;