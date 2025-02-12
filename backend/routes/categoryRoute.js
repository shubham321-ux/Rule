import express from "express";
import {
    createCategory, getCategories, updateCategory, deleteCategory 
} from "../controllers/categotyController.js";
import { isauthenticatedUser,authorizeRolesadmin } from "../middleware/auth.js";

const Categoryrouter = express.Router();

Categoryrouter.post("/create-category",isauthenticatedUser,authorizeRolesadmin, createCategory );
Categoryrouter.get("/getAll-categories", getCategories);
Categoryrouter.put("/update-category/:id",isauthenticatedUser,authorizeRolesadmin, updateCategory);
Categoryrouter.delete("/delete-category/:id",isauthenticatedUser,authorizeRolesadmin, deleteCategory);

export default Categoryrouter;
