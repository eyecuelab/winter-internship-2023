// seed Route

import seedController from "../Controllers/seed";
import express from "express";

const router = express.Router();

router.post("/seed", seedController.createSeeds);

export default router;