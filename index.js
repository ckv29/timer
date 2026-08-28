    const RADIUS = 90;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const minutesInput    = document.getElementById('minutes-input');
    const startBtn        = document.getElementById('start-btn');
    const resetBtn        = document.getElementById('reset-btn');
    const spinner         = document.getElementById('spinner');
    const progressCircle  = document.getElementById('progress-circle');
    const timeDisplay     = document.getElementById('time-display');
    const statusEl        = document.getElementById('status');

    // Инициализация SVG-круга
    progressCircle.style.strokeDasharray  = CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = CIRCUMFERENCE; // пусто в начале

    // Состояние таймера
    let intervalId      = null;
    let totalSeconds    = 0;
    let initialSeconds  = 0;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }

    function updateProgress(remainingSeconds) {
      // Прогресс: сколько времени УЖЕ прошло (от 0 до 1)
      const elapsed  = initialSeconds - remainingSeconds;
      const progress = elapsed / initialSeconds;

      // Смещение штриховки: чем больше прошло — тем меньше offset
      const offset = CIRCUMFERENCE * (1 - progress);
      progressCircle.style.strokeDashoffset = offset;

      // Смена цвета в зависимости от оставшегося времени
      const ratio = remainingSeconds / initialSeconds;
      if (ratio > 0.5)       progressCircle.style.stroke = '#4cc9f0'; // голубой
      else if (ratio > 0.2)  progressCircle.style.stroke = '#f9c74f'; // жёлтый
      else                   progressCircle.style.stroke = '#e94560'; // красный
    }

    function startTimer(minutes) {
      stopTimer();

      initialSeconds = minutes * 60;
      totalSeconds   = initialSeconds;

      // Блокируем инпут во время работы
      minutesInput.disabled = true;
      startBtn.disabled     = true;
      resetBtn.disabled     = false;
      spinner.classList.add('active');
      statusEl.classList.remove('finished');
      statusEl.textContent = 'Таймер запущен...';

      // Первичная отрисовка
      timeDisplay.textContent = formatTime(totalSeconds);
      updateProgress(totalSeconds);

      // Запуск интервала — обновление каждую секунду
      intervalId = setInterval(() => {
        totalSeconds--;

        // Синхронное обновление текста и круга
        timeDisplay.textContent = formatTime(totalSeconds);
        updateProgress(totalSeconds);

        // Уведомление каждую минуту (как в предыдущей версии)
        const currentMinutes = Math.floor(totalSeconds / 60);
        const prevMinutes    = Math.floor((totalSeconds + 1) / 60);
        if (currentMinutes < prevMinutes && totalSeconds > 0) {
          console.log(`⏰ Осталось минут: ${currentMinutes}`);
        }

        // Завершение
        if (totalSeconds <= 0) {
          finishTimer();
        }
      }, 1000);
    }

    function finishTimer() {
      clearInterval(intervalId);
      intervalId = null;

      timeDisplay.textContent = '00:00';
      statusEl.textContent    = '✅ Время вышло! Отсчёт завершён.';
      statusEl.classList.add('finished');

      // Возвращаем UI в исходное состояние
      minutesInput.disabled = false;
      startBtn.disabled     = false;
      spinner.classList.remove('active');

      alert('🎉 Время вышло! Отсчёт завершён.');
    }

    // Остановка (без финального сообщения)
    function stopTimer() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    // ============================================
    // Сброс таймера
    // ============================================
    function resetTimer() {
      stopTimer();

      totalSeconds   = 0;
      initialSeconds = 0;

      // Сброс UI
      minutesInput.disabled = false;
      startBtn.disabled     = false;
      resetBtn.disabled     = true;
      spinner.classList.remove('active');
      statusEl.classList.remove('finished');
      statusEl.textContent  = 'Таймер сброшен. Введите минуты.';

      // Сброс визуализации
      timeDisplay.textContent = '00:00';
      progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
      progressCircle.style.stroke = '#4cc9f0';
    }

    startBtn.addEventListener('click', () => {
      const minutes = parseInt(minutesInput.value, 10);

      // Валидация: от 1 до 99 минут
      if (isNaN(minutes) || minutes < 1 || minutes > 99) {
        alert('Введите целое число от 1 до 99 минут.');
        return;
      }

      startTimer(minutes);
    });
    
    resetBtn.addEventListener('click', resetTimer);

    // Ограничение ввода в инпут (не более 99)
    minutesInput.addEventListener('input', () => {
      let val = parseInt(minutesInput.value, 10);
      if (val > 99) minutesInput.value = 99;
      if (val < 0)  minutesInput.value = '';
    });