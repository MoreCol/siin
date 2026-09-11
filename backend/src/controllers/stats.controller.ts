import { Request, Response } from 'express';
import { StatsService } from '../service/stats.service';

const service = new StatsService();

export const getResumen = async (_: Request, res: Response) => {
  try {
    const data = await service.getResumen();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};