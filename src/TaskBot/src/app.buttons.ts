import { Markup } from 'telegraf';

export function taskActionsKeyboard() {
  return Markup.keyboard(
    [
      Markup.button.callback('➕ Create Task', 'createTask'),
      Markup.button.callback('📃 Task List', 'taskList'),
      Markup.button.callback('☑️ Mark as completed', 'completeTask'),
      Markup.button.callback('📝 Edit Task', 'editTask'),
      Markup.button.callback('❌ Delete Task', 'deleteTask'),
      Markup.button.callback('🗑️ Delete All', 'deleteAll'),
      Markup.button.callback('📊 Statistics', 'statistics'),
      Markup.button.callback('✅ Show Completed', 'showCompleted'),
      Markup.button.callback('⏺️ Show Pending', 'showPending'),
      Markup.button.callback('🔄 Mark All Complete', 'markAllComplete'),
      Markup.button.callback('↩️ Mark All Pending', 'markAllPending'),
      Markup.button.callback('🎯 Random Task', 'randomTask'),
    ],
    {
      columns: 2,
    },
  ).resize();
}
