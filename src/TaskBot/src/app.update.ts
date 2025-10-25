import { AppService } from './app.service';
import {
  Start,
  Ctx,
  InjectBot,
  Update,
  Hears,
  On,
  Message,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { taskActionsKeyboard } from './app.buttons';
import type { Context } from './app.interface';
import { TaskRecord } from './app.task-record.entity';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  formatList = (items: TaskRecord[]) => {
    if (!items || items.length === 0) return 'The list is empty 🚀';

    const list = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.resolved ? '✅' : '⏺️'} ${item.name}`,
      )
      .join('\n');

    return `Your to-do list:\n\n${list}`;
  };

  private isValidNumber(str: string): boolean {
    const num = Number(str);
    return !isNaN(num) && isFinite(num) && num > 0 && Number.isInteger(num);
  }

  @Start()
  async begin(@Ctx() ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = null;

    await ctx.reply('What do you want?', taskActionsKeyboard());
  }

  @Hears('📃 Task List')
  async taskList(ctx: Context) {
    const items = await this.appService.getAll();
    await ctx.reply(this.formatList(items));
  }

  @Hears('➕ Create Task')
  async createTask(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'createTask';
    await ctx.reply('Describe the task:');
  }

  @Hears('☑️ Mark as completed')
  async completeTask(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'completeTask';
    await ctx.reply('Write down the task ID: ');
  }

  @Hears('📝 Edit Task')
  async editTask(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'editTask';
    await ctx.reply('Write down the task ID: ');
  }

  @Hears('❌ Delete Task')
  async deleteTask(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'deleteTask';
    await ctx.reply('Write down the task ID: ');
  }

  @Hears('📊 Statistics')
  async showStatistics(ctx: Context) {
    const stats = await this.appService.getStatistics();

    const message = `
    📊 Task Statistics:

  📝 Total tasks: ${stats.total}
  ✅ Completed: ${stats.completed}
  ⏺️ Pending: ${stats.pending}
  📈 Completion rate: ${stats.completionRate}%
  `;

    await ctx.reply(message.trim());
  }

  @Hears('🗑️ Delete All')
  async deleteAllTasks(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'deleteAll';
    await ctx.reply(
      '⚠️ Are you sure you want to delete ALL tasks? Type "yes" to confirm or any other text to cancel.',
    );
  }

  @Hears('✅ Show Completed')
  async showCompleted(ctx: Context) {
    const items = await this.appService.getCompleted();

    if (!items || items.length === 0) {
      await ctx.reply('You have no completed tasks yet! 🎯');
      return;
    }

    const list = items
      .map((item, idx) => `${idx + 1}. ✅ ${item.name}`)
      .join('\n');

    await ctx.reply(`Completed tasks:\n\n${list}`);
  }

  @Hears('⏺️ Show Pending')
  async showPending(ctx: Context) {
    const items = await this.appService.getPending();

    if (!items || items.length === 0) {
      await ctx.reply('You have no pending tasks! Great job! 🎉');
      return;
    }

    const list = items
      .map((item, idx) => `${idx + 1}. ⏺️ ${item.name}`)
      .join('\n');

    await ctx.reply(`Pending tasks:\n\n${list}`);
  }

  @Hears('🔄 Mark All Complete')
  async markAllComplete(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'markAllComplete';
    await ctx.reply(
      '⚠️ Mark ALL tasks as completed? Type "yes" to confirm or any other text to cancel.',
    );
  }

  @Hears('↩️ Mark All Pending')
  async markAllPending(ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.type = 'markAllPending';
    await ctx.reply(
      '⚠️ Mark ALL tasks as pending? Type "yes" to confirm or any other text to cancel.',
    );
  }

  @Hears('🎯 Random Task')
  async randomTask(ctx: Context) {
    const task = await this.appService.getRandomPendingTask();

    if (!task) {
      await ctx.reply('You have no pending tasks! 🎉');
      return;
    }

    await ctx.reply(`🎯 Random task to work on:\n\n⏺️ ${task.name}`);
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session) {
      ctx.session = {};
    }

    const actionType = ctx.session.type;

    if (!actionType) {
      await ctx.reply('⚠️ Incorrect command', taskActionsKeyboard());
      return;
    }

    let items: TaskRecord[] | null = null;

    try {
      switch (actionType) {
        case 'createTask':
          if (!message.trim()) {
            await ctx.reply('❌ The task name cannot be empty!');
            return;
          }
          items = await this.appService.createTask(message);
          break;

        case 'completeTask':
          if (!this.isValidNumber(message)) {
            ctx.session.type = null;
            await ctx.reply(
              '❌ Incorrect ID format! Enter a positive integer.',
            );
            return;
          }

          items = await this.appService.completeTask(Number(message));
          if (!items) {
            ctx.session.type = null;
            await ctx.reply('❌ No tasks found with this ID!');
            return;
          }
          break;

        case 'editTask':
          if (!ctx.session.editTaskId) {
            if (!this.isValidNumber(message)) {
              ctx.session.type = null;
              await ctx.reply(
                '❌ Incorrect ID format! Enter a positive integer.',
              );
              return;
            }

            const taskId = Number(message);

            const taskExists = await this.appService.checkTaskExists(taskId);
            if (!taskExists) {
              ctx.session.type = null;
              await ctx.reply('❌ No tasks found with this ID!');
              return;
            }

            ctx.session.editTaskId = taskId;
            await ctx.reply('Enter new text for the task:');
            return;
          } else {
            if (!message.trim()) {
              await ctx.reply('❌ The task text cannot be empty!');
              return;
            }

            items = await this.appService.editTask(
              ctx.session.editTaskId,
              message,
            );
            ctx.session.editTaskId = undefined;

            if (!items) {
              ctx.session.type = null;
              await ctx.reply('❌ Error editing task!');
              return;
            }
          }
          break;

        case 'deleteTask':
          if (!this.isValidNumber(message)) {
            ctx.session.type = null;
            await ctx.reply(
              '❌ Incorrect ID format! Enter a positive integer.',
            );
            return;
          }

          items = await this.appService.deleteTask(Number(message));
          if (!items) {
            ctx.session.type = null;
            await ctx.reply('❌ No tasks found with this ID!');
            return;
          }
          break;

        case 'deleteAll':
          if (message.toUpperCase() === 'YES') {
            items = await this.appService.deleteAll();
            ctx.session.type = null;
            await ctx.reply('🗑️ All tasks have been deleted!');
          } else {
            ctx.session.type = null;
            await ctx.reply('❌ Deletion cancelled.');
            return;
          }
          break;

        case 'markAllComplete':
          if (message.toUpperCase() === 'YES') {
            items = await this.appService.markAllComplete();
            ctx.session.type = null;
            await ctx.reply('✅ All tasks marked as completed!');
          } else {
            ctx.session.type = null;
            await ctx.reply('❌ Operation cancelled.');
            return;
          }
          break;

        case 'markAllPending':
          if (message.toUpperCase() === 'YES') {
            items = await this.appService.markAllPending();
            ctx.session.type = null;
            await ctx.reply('↩️ All tasks marked as pending!');
          } else {
            ctx.session.type = null;
            await ctx.reply('❌ Operation cancelled.');
            return;
          }
          break;

        default:
          ctx.session.type = null;
          await ctx.reply('⚠️ Incorrect command', taskActionsKeyboard());
          return;
      }

      ctx.session.type = null;

      if (items) {
        await ctx.reply(this.formatList(items));
      }
    } catch (error) {
      console.error('Error in getMessage:', error);
      ctx.session.type = null;
      ctx.session.editTaskId = undefined;
      await ctx.reply(
        '❌ There was an error! Try again.',
        taskActionsKeyboard(),
      );
    }
  }
}
