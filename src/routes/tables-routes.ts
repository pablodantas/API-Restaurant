import { Router } from "express";
import { TablesController } from "@/controllers/tables-controller";

const tablesRoutes = Router();
const tablesController = new TablesController();

tablesRoutes.get("/", tablesController.index);
// TablesRoutes.post("/", tablesController.create);
// TablesRoutes.put("/:id", tablesController.update);
// TablesRoutes.delete("/:id", tablesController.remove);

export {tablesRoutes}