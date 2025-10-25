import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRecord } from './app.task-record.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskRecord)
    private readonly taskRepo: Repository<TaskRecord>,
  ) {}

  async getAll(): Promise<TaskRecord[]> {
    return this.taskRepo.find({
      order: { id: 'ASC' },
    });
  }

  async createTask(name: string): Promise<TaskRecord[]> {
    const cleanName = (name ?? '').toString().trim();
    if (!cleanName) return this.getAll();

    const task = this.taskRepo.create({ name: cleanName });
    await this.taskRepo.save(task);

    return this.getAll();
  }

  private async getTaskByIndex(index: number): Promise<TaskRecord | null> {
    const tasks = await this.getAll();
    if (index < 1 || index > tasks.length) return null;
    return tasks[index - 1];
  }

  async checkTaskExists(index: number): Promise<boolean> {
    const task = await this.getTaskByIndex(index);
    return task !== null;
  }

  async completeTask(index: number): Promise<TaskRecord[] | null> {
    const task = await this.getTaskByIndex(index);
    if (!task) return null;

    task.resolved = !task.resolved;
    await this.taskRepo.save(task);

    return this.getAll();
  }

  async editTask(index: number, name: string): Promise<TaskRecord[] | null> {
    const task = await this.getTaskByIndex(index);
    if (!task) return null;

    task.name = name;
    await this.taskRepo.save(task);

    return this.getAll();
  }

  async deleteTask(index: number): Promise<TaskRecord[] | null> {
    const task = await this.getTaskByIndex(index);
    if (!task) return null;

    await this.taskRepo.delete({ id: task.id });
    return this.getAll();
  }

  async getCompleted(): Promise<TaskRecord[]> {
    return this.taskRepo.find({
      where: { resolved: true },
      order: { id: 'ASC' },
    });
  }

  async getPending(): Promise<TaskRecord[]> {
    return this.taskRepo.find({
      where: { resolved: false },
      order: { id: 'ASC' },
    });
  }

  async deleteAll(): Promise<TaskRecord[]> {
    await this.taskRepo.clear();
    return this.getAll();
  }

  async getStatistics(): Promise<{
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  }> {
    const total = await this.taskRepo.count();
    const completed = await this.taskRepo.count({ where: { resolved: true } });
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
    };
  }

  async markAllComplete(): Promise<TaskRecord[]> {
    await this.taskRepo
      .createQueryBuilder()
      .update(TaskRecord)
      .set({ resolved: true })
      .execute();

    return await this.getAll();
  }

  async markAllPending(): Promise<TaskRecord[]> {
    await this.taskRepo
      .createQueryBuilder()
      .update(TaskRecord)
      .set({ resolved: false })
      .execute();

    return await this.getAll();
  }

  async getRandomPendingTask(): Promise<TaskRecord | null> {
    const pendingTasks = await this.getPending();
    if (pendingTasks.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * pendingTasks.length);
    return pendingTasks[randomIndex];
  }
}
