
import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { Construction } from 'lucide-react';

type Priority = 'Urgente' | 'Moyenne' | 'Basse';

type Todo = {
  id: number;
  text: string;
  priority: Priority;
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

  function finishedTodos() {
    const newTodos = todos.filter((todo) => {
      if (selectedTodos.has(todo.id)) {
        return false;
      }
      return true;
    });
    setTodos(newTodos);
    setSelectedTodos(new Set());
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
      </div>

    </div>
  )
}

export default App
