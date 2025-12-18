# PROMPT: Исправление и развертывание проекта на GitHub Pages

## КОНТЕКСТ:
У тебя есть React+Vite проект, который нужно развернуть на GitHub Pages. Проект находится в репозитории nexus-32/nexus-32.github.io. Сейчас сайт показывает белый экран с ошибками 404 для CSS/JS файлов.

## ТЕКУЩАЯ ПРОБЛЕМА:
- Сайт загружается но показывает белый экран
- В консоли ошибки: "Failed to load resource: the server responded with a status of 404" для CSS и JS файлов
- Пути к ассетам в index.html неправильные

## ЧТО НУЖНО СДЕЛАТЬ:

### 1. Проверить текущее состояние:
- Проверить vite.config.ts - base path должен быть "/mindweaver-ai/"
- Проверить src/App.tsx - BrowserRouter должен иметь basename="/mindweaver-ai"
- Проверить структуру gh-pages ветки

### 2. Исправить конфигурацию:
- Убедиться что vite.config.ts имеет правильный base path
- Убедиться что React Router имеет правильный basename
- Пересобрать проект: npm run build

### 3. Обновить GitHub Pages:
- Переключиться на gh-pages ветку
- Скопировать файлы из dist в корень
- Закоммитить и запушить изменения

### 4. Проверить результат:
- Зайти на https://nexus-32.github.io/mindweaver-ai/
- Проверить что все ассеты загружаются без ошибок
- Проверить что маршрутизация работает

## ИНСТРУКЦИИ:

1. **Проверь vite.config.ts:**
```typescript
base: mode === "production" ? "/mindweaver-ai/" : "/",
```

2. **Проверь src/App.tsx:**
```tsx
<BrowserRouter basename="/mindweaver-ai">
```

3. **Пересобери проект:**
```bash
npm run build
```

4. **Обнови gh-pages:**
```bash
git checkout gh-pages
Copy-Item -Path 'dist\*' -Destination '.' -Recurse -Force
git add index.html assets/
git commit -m "Update GitHub Pages"
git push origin gh-pages
```

5. **Проверь результат:**
- Очисти кэш браузера
- Проверь консоль на отсутствие ошибок
- Убедись что сайт работает

## ЦЕЛЬ:
Сайт должен полноценно работать на https://nexus-32.github.io/mindweaver-ai/ без ошибок 404 и с работающей навигацией.

## ЗАМЕЧАНИЯ:
- nexus-32.github.io это специальный репозиторий для GitHub Pages
- Проект должен быть доступен по пути /mindweaver-ai/
- Все ассеты должны иметь правильные относительные пути
