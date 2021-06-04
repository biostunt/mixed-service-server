import { Response } from "express";
export function sendFile(filepath: string) {
    return (res: Response) => res.sendFile(filepath);
}
