import { useState, useEffect } from 'react';
import './App.css';

interface Task {
  _id?: string;
  id?: number;
  text: string;
  completed: boolean;
  createdAt?: number;
}

type FilterType = 'all' | 'completed' | 'pending';

export default function App() {
  const [taskarium, inscribeTaskarium] = useState<Task[]>([]);
  const [scribulum, scribeScribulum] = useState('');
  const [strigil, applyStrigil] = useState<FilterType>('all');
  const [palimpsestId, etchPalimpsestId] = useState<string | null>(null);
  const [palimpsestText, etchPalimpsestText] = useState('');

  const [sigilPurgePanel, toggleSigilPurgePanel] = useState(false);
  const [oraclePanel, toggleOraclePanel] = useState(false);
  const [oracleUtterance, speakOracleUtterance] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tasks`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        inscribeTaskarium(data);
      } catch (err) {
        console.error('Error loading tasks:', err);
        if (err instanceof Error) {
          alert(`Error loading tasks: ${err.message}`);
        } else {
          alert('An unknown error occurred while loading tasks.');
        }
      }
    };
    fetchTasks();
  }, [API_URL]);

  const conscriptTask = async () => {
    if (!scribulum.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scribulum.trim() }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const newTask = await res.json();
      inscribeTaskarium([newTask, ...taskarium]);
      scribeScribulum('');
    } catch (err) {
      console.error('Error creating task:', err);
      if (err instanceof Error) {
        alert(`Error creating task: ${err.message}`);
      } else {
        alert('An unknown error occurred while creating task.');
      }
    }
  };

  const obliterateEntry = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      inscribeTaskarium(taskarium.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      if (err instanceof Error) {
        alert(`Error deleting task: ${err.message}`);
      } else {
        alert('An unknown error occurred while deleting task.');
      }
    }
  };

  const invertoFulfill = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const updated = await res.json();
      inscribeTaskarium(taskarium.map(t => (t._id === id ? updated : t)));
    } catch (err) {
      console.error('Error updating task:', err);
      if (err instanceof Error) {
        alert(`Error updating task: ${err.message}`);
      } else {
        alert('An unknown error occurred while updating task.');
      }
    }
  };

  const incipitEdit = (task: Task) => {
    etchPalimpsestId(task._id!);
    etchPalimpsestText(task.text);
  };

  const commitPalimpsest = async () => {
    if (!palimpsestText.trim() || palimpsestId === null) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${palimpsestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: palimpsestText.trim() }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const updated = await res.json();
      inscribeTaskarium(taskarium.map(task => (task._id === palimpsestId ? updated : task)));
      etchPalimpsestId(null);
      etchPalimpsestText('');
    } catch (err) {
      console.error('Error editing task:', err);
      if (err instanceof Error) {
        alert(`Error editing task: ${err.message}`);
      } else {
        alert('An unknown error occurred while editing task.');
      }
    }
  };

  const revertPalimpsest = () => {
    etchPalimpsestId(null);
    etchPalimpsestText('');
  };

  const invokePurgeRitual = () => {
    toggleSigilPurgePanel(true);
  };

  const executePurgeRitual = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      inscribeTaskarium([]);
      toggleSigilPurgePanel(false);
    } catch (err) {
      console.error('Error deleting all tasks:', err);
      if (err instanceof Error) {
        alert(`Error deleting all tasks: ${err.message}`);
      } else {
        alert('An unknown error occurred while deleting all tasks.');
      }
    }
  };

  const divineRandom = () => {
    const pendingTasks = taskarium.filter(task => !task.completed);
    if (pendingTasks.length > 0) {
      const randomTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
      speakOracleUtterance(`Random task: ${randomTask.text}`);
    } else {
      speakOracleUtterance('No unfinished tasks!');
    }
    toggleOraclePanel(true);
  };

  const ordainAllComplete = () => {
    inscribeTaskarium(taskarium.map(task => ({ ...task, completed: true })));
  };

  const rescindAllComplete = () => {
    inscribeTaskarium(taskarium.map(task => ({ ...task, completed: false })));
  };

  const siftedTaskarium = taskarium.filter(task => {
    if (strigil === 'completed') return task.completed;
    if (strigil === 'pending') return !task.completed;
    return true;
  });

  const tally = {
    total: taskarium.length,
    completed: taskarium.filter(t => t.completed).length,
    pending: taskarium.filter(t => !t.completed).length,
  };

  return (
    <div className="aurora-shell">
      <div className="codex-pane">
        <h1 className="gazette-title">📝 To-Do List</h1>

        <div className="scribe-section">
          <input
            type="text"
            className="scribe-field"
            placeholder="Add a new task"
            value={scribulum}
            onChange={(e) => scribeScribulum(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && conscriptTask()}
          />
          <button className="scribe-incept" onClick={conscriptTask}>
            Add
          </button>
        </div>

        <div className="tally-bar">
          <div className="tally-node">
            <span className="tally-caption">All:</span>
            <span className="tally-figure">{tally.total}</span>
          </div>
          <div className="tally-node">
            <span className="tally-caption">Completed:</span>
            <span className="tally-figure">{tally.completed}</span>
          </div>
          <div className="tally-node">
            <span className="tally-caption">In the process:</span>
            <span className="tally-figure">{tally.pending}</span>
          </div>
        </div>

        <div className="completion-rate">
          <div className="completion-label">Completion rate</div>
          <div className="completion-bar">
            <div
              className="completion-fill"
              style={{ width: `${tally.total > 0 ? (tally.completed / tally.total * 100) : 0}%` }}
            ></div>
          </div>
          <div className="completion-percentage">
            {tally.total > 0 ? Math.round(tally.completed / tally.total * 100) : 0}%
          </div>
        </div>

        <div className="sieve-row">
          <button
            className={`sieve-toggle ${strigil === 'all' ? 'active' : ''}`}
            onClick={() => applyStrigil('all')}
          >
            All
          </button>
          <button
            className={`sieve-toggle ${strigil === 'completed' ? 'active' : ''}`}
            onClick={() => applyStrigil('completed')}
          >
            Completed
          </button>
          <button
            className={`sieve-toggle ${strigil === 'pending' ? 'active' : ''}`}
            onClick={() => applyStrigil('pending')}
          >
            In the process
          </button>
        </div>

        <div className="arsenal">
          <button className="arsenal-press coronate" onClick={ordainAllComplete}>
            ✓ Mark all
          </button>
          <button className="arsenal-press palliate" onClick={rescindAllComplete}>
            ○ Remove marks
          </button>
          <button className="arsenal-press oracle" onClick={divineRandom}>
            🎲 Random
          </button>
          <button className="arsenal-press purge" onClick={invokePurgeRitual}>
            🗑️ Delete all
          </button>
        </div>

        <div className="taskarium-list">
          {siftedTaskarium.length === 0 ? (
            <div className="void-state">
              {strigil === 'all' && 'No tasks. Add the first one!'}
              {strigil === 'completed' && 'No completed tasks'}
              {strigil === 'pending' && 'No tasks in progress'}
            </div>
          ) : (
            siftedTaskarium.map(task => (
              <div key={task._id || task.id} className={`task-node ${task.completed ? 'completed' : ''}`}>
                <div className="task-core">
                  <input
                    type="checkbox"
                    className="task-toggle"
                    checked={task.completed}
                    onChange={() => invertoFulfill(task._id!, task.completed)}
                  />
                  {palimpsestId === task._id ? (
                    <input
                      type="text"
                      className="palimpsest-field"
                      value={palimpsestText}
                      onChange={(e) => etchPalimpsestText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && commitPalimpsest()}
                      autoFocus
                    />
                  ) : (
                    <span className="task-lemma">{task.text}</span>
                  )}
                </div>
                <div className="task-rituals">
                  {palimpsestId === task._id ? (
                    <>
                      <button className="glyph-save" onClick={commitPalimpsest}>
                        ✓
                      </button>
                      <button className="glyph-abort" onClick={revertPalimpsest}>
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="glyph-edit" onClick={() => incipitEdit(task)}>
                        ✏️
                      </button>
                      <button className="glyph-delete" onClick={() => obliterateEntry(task._id!)}>
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {sigilPurgePanel && (
        <div className="veil-overlay">
          <div className="sigil-modal">
            <div className="sigil-utterance">Are you sure you want to delete all tasks?</div>
            <div className="sigil-controls">
              <button className="sigil-btn sigil-btn-affirm" onClick={executePurgeRitual}>
                Yes
              </button>
              <button className="sigil-btn sigil-btn-null" onClick={() => toggleSigilPurgePanel(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {oraclePanel && (
        <div className="veil-overlay">
          <div className="sigil-modal">
            <div className="sigil-utterance">{oracleUtterance}</div>
            <div className="sigil-controls">
              <button className="sigil-btn sigil-btn-ok" onClick={() => toggleOraclePanel(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}