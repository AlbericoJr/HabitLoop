// Seleção de elementos
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Estado da aplicação
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let currentFilter = 'all';

// Função para Adicionar Hábito
habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = habitInput.value.trim();
    
    if(text === "") return;

    const newHabit = {
        id: Date.now(),
        name: text,
        completed: false,
        streak: 0,
    };

    habits.push(newHabit);
    saveAndRender();
    habitInput.value = '';
    habitInput.focus();
});

// Alternar Conclusão e Streak
function toggleHabit(id) {
    habits = habits.map(habit => {
        if (habit.id === id) {
            const isNowCompleted = !habit.completed;
            let newStreak = habit.streak;

            if (isNowCompleted) {
                newStreak += 1;
            } else {
                newStreak = Math.max(0, newStreak - 1);
            }

            return { ...habit, completed: isNowCompleted, streak: newStreak };
        }
        return habit;
    });
    saveAndRender();
}

// --- NOVA FUNÇÃO DE DELETAR COM ANIMAÇÃO ---
function deleteHabit(id, buttonElement) {
    // Encontra o elemento <li> pai do botão clicado
    const habitItem = buttonElement.closest('.habit-item');
    
    // Adiciona a classe que dispara a animação CSS de saída
    habitItem.classList.add('fall');

    // Espera a animação 'fallOff' terminar antes de remover os dados
    habitItem.addEventListener('animationend', function() {
        // Remove do array de dados
        habits = habits.filter(habit => habit.id !== id);
        // Salva e renderiza a lista atualizada
        saveAndRender();
    });
}

// Filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderHabits();
    });
});

// Salvar no LocalStorage e Renderizar
function saveAndRender() {
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

// Renderização na Tela
function renderHabits() {
    habitList.innerHTML = '';

    const filteredHabits = habits.filter(habit => {
        if (currentFilter === 'pending') return !habit.completed;
        if (currentFilter === 'completed') return habit.completed;
        return true;
    });

    filteredHabits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.className = `habit-item ${habit.completed ? 'completed' : ''}`;
        
        // Adiciona um pequeno atraso escalonado na entrada de cada item
        // para um efeito de cascata suave ao carregar a lista
        li.style.animationDelay = `${index * 0.05}s`;

        li.innerHTML = `
            <div class="habit-info">
                <input type="checkbox" ${habit.completed ? 'checked' : ''} 
                    onchange="toggleHabit(${habit.id})"> <span class="habit-text">${habit.name}</span>
                ${habit.streak > 0 ? `<span class="streak-badge"><i class="fas fa-fire"></i> ${habit.streak}</span>` : ''}
            </div>
            <button class="btn-delete" onclick="deleteHabit(${habit.id}, this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        habitList.appendChild(li);
    });
}

// Inicialização
renderHabits();