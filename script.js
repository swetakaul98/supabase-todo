// 👇 Replace with your actual values
const SUPABASE_URL = 'https://tijkfncoogezindugtcj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpamtmbmNvb2dlemluZHVndGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTY3MjYsImV4cCI6MjA2MDU3MjcyNn0.6hQVHn3MsRN47UnQYpnry4aHeLBFkBZkLHifuEYANAI';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const loadTodos = async () => {
  const { data, error } = await client
    .from('todos')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    alert('Error loading todos!');
    console.error(error);
    return;
  }

  list.innerHTML = '';
  data.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.title;
    li.className = todo.completed ? 'completed' : '';
    li.addEventListener('click', () => toggleComplete(todo.id, !todo.completed));
    list.appendChild(li);
  });
};

const toggleComplete = async (id, completed) => {
  await client.from('todos').update({ completed }).eq('id', id);
  loadTodos();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
  
    const { error } = await client.from('todos').insert([{ title, completed: false }]);
  
    if (error) {
      console.error('Failed to add todo:', error.message);
      alert('Error adding todo');
      return;
    }
  
    input.value = '';
    loadTodos(); // 👈 this refreshes the list without needing manual refresh
  });
  
client
  .channel('public:todos')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'todos' },
    (payload) => {
      console.log('Change received!', payload);
      loadTodos(); // refresh UI on DB change
    }
  )
  .subscribe();

loadTodos();