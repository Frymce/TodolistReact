
import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { Construction, Trash } from 'lucide-react';

type Priority = 'Urgente' | 'Moyenne' | 'Basse';

type Todo = {
  id: number;
  text: string;
  priority: Priority;
  completedAt?: string;
}

function App() {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority>('Moyenne');

  const savedTodos = localStorage.getItem('todos');
  const intialTodos = savedTodos ? JSON.parse(savedTodos) : [];

  const [todos, setTodos] = useState<Todo[]>(intialTodos);

  const [filter, setFilter] = useState<Priority | "Tous">("Tous");



  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));

  }, [todos])

  function addTodo() {
    if (input.trim() == "") {
      return;
    }
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority
    }
    const newTodos = [newTodo, ...todos]
    setTodos(newTodos);
    setInput("");
    setPriority('Moyenne');
    console.log(todos);
  }

  let filteredTodos: Todo[] = [];

  if (filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter);
  }

  const urgentCount = todos.filter((todo) => todo.priority === 'Urgente').length;
  const moyenneCount = todos.filter((todo) => todo.priority === 'Moyenne').length;
  const basseCount = todos.filter((todo) => todo.priority === 'Basse').length;
  const totalCount = todos.length;

  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  function toggleSelectedTodo(id: number) {
    const newSelectedTodos = new Set(selectedTodos);
    if (newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id);
    } else {
      newSelectedTodos.add(id);
    }
    setSelectedTodos(newSelectedTodos);
  }

  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  function finishedTodos() {
    const completedItems: Todo[] = [];
    const newTodos = todos.filter((todo) => {
      if (selectedTodos.has(todo.id)) {
        completedItems.push({ ...todo, completedAt: new Date().toISOString() });
        return false;
      }
      return true;
    });
    setCompletedTodos([...completedItems, ...completedTodos]);
    setTodos(newTodos);
    setSelectedTodos(new Set());
  }

  function deleteCompletedTodo(id: number) {
    const newCompletedTodos = completedTodos.filter((todo) => todo.id !== id);
    setCompletedTodos(newCompletedTodos);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Ajouter une tâche..."
            className="input input-bordered w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="select select-bordered w-full max-w-xs">
            <option disabled selected>Priorité</option>
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button
            onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>
        <div className=' space-y-2 flex-1 h-fit'>

          <div className="flex items-center justify-between">
            <div className='flex flex-wrap gap-4'>
              <button
                className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Tous")}>
                Tous ({totalCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Urgente")}>
                Urgente ({urgentCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Moyenne")}>
                Moyenne ({moyenneCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Basse")}>
                Basse ({basseCount})
              </button>
            </div>
            <button 
            onClick={finishedTodos}
            className=" btn btn-primary"
            disabled={selectedTodos.size === 0}
            
            >
              Finir la sélection ({selectedTodos.size})
            </button>
          </div>

          {filteredTodos.length > 0 ? (
            <ul className='divide-y divide-primary/20'>
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    isSelected={selectedTodos.has(todo.id)}
                    todo={todo}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={() => toggleSelectedTodo(todo.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className="flex justify-center items-center flex-col p-5 ">
              <div>
                <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">Aucune tâche trouvée</p>
            </div>
          )}
        </div>

        {/* Section des tâches terminées */}
        {completedTodos.length > 0 && (
          <div className="mt-6 border-t border-primary/20 pt-4">
            <h2 className="text-xl font-bold text-success mb-3">
              Tâches terminées ({completedTodos.length})
            </h2>
            <ul className='divide-y divide-success/20'>
              {completedTodos.map((todo) => (
                <li key={todo.id} className="p-3 opacity-60">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-md font-bold">
                        {todo.text}
                      </span>
                      <span className={`badge badge-sm badge-soft ${todo.priority === 'Urgente' ? 'badge-error' : todo.priority === 'Moyenne' ? 'badge-warning' : 'badge-success'}`}>
                        {todo.priority}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCompletedTodo(todo.id)}
                      className="btn btn-sm btn-error btn-soft">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  )
}

export default App
