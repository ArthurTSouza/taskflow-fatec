import { Router, Request, Response, NextFunction } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  handleControllerError,
  listTasks,
  updateTask
} from "../controllers/taskController";

const router = Router();

function asyncHandler(
  handler: (req: Request, res: Response) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res).catch((error: unknown) => {
      handleControllerError(error, res);
      if (!res.headersSent) next(error);
    });
  };
}

router.get("/", asyncHandler(listTasks));
router.get("/:id", asyncHandler(getTask));
router.post("/", asyncHandler(createTask));
router.put("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
