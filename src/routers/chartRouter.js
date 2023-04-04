import express from "express";
import { findChart } from "../controllers/chartController";
const chartRouter = express.Router();

chartRouter.get("/", findChart);

export default chartRouter;
