import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../../utils/CustomError";

const imageBackUp = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;

  const imageNewName = `${file.originalname}-${Date.now()}`;

  fs.rename(
    path.join("uploads", "image", file.filename),
    path.join("uploads", "image", imageNewName)
  );

  const readFile = await fs.readFile(
    path.join("uploads", "image", imageNewName)
  );

  const supabase = createClient(
    "https://taoafepnmecqsvtyeefw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhb2FmZXBubWVjcXN2dHllZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI5MDA2MzMsImV4cCI6MTk3ODQ3NjYzM30.opP2SIcnV_7npd-aq6nGDW9vUzUV6vus8qi5sjzA-Nw"
  );

  const storage = supabase.storage.from("philoapp.images");
  const uploadResult = await storage.upload(imageNewName, readFile);

  if (uploadResult.error) {
    const uploadError = new CustomError(
      400,
      uploadResult.error.message,
      "Error uploading the image"
    );
    next(uploadError);
  }

  const { publicURL: backUpUrl } = storage.getPublicUrl(imageNewName);

  req.body.image = imageNewName;
  req.body.backUpImage = backUpUrl;

  next();
};

export default imageBackUp;
