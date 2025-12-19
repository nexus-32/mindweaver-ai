# GitHub Pages Deployment Guide

## Обновление сайта https://nexus-32.github.io/

### Текущая конфигурация
- **Репозиторий:** nexus-32.github.io (user/organization GitHub Pages)
- **URL сайта:** https://nexus-32.github.io/
- **Базовый путь:** `/` (корень домена)
- **Ветка развертывания:** `gh-pages`

### Шаги для обновления сайта

#### 1. Подготовка к развертыванию
```bash
# Переключиться на ветку main для разработки
git checkout main

# Убедиться, что конфигурация правильная:
# vite.config.ts должен иметь base: "/"
# src/App.tsx должен иметь <BrowserRouter> без basename
```

#### 2. Сборка проекта
```bash
# Собрать проект для production
bun run build
```

#### 3. Развертывание на GitHub Pages
```bash
# Переключиться на ветку gh-pages
git checkout gh-pages

# Скопировать собранные файлы
Copy-Item -Path 'dist\*' -Destination '.' -Force -Recurse

# Добавить изменения в git
git add index.html assets/

# Создать коммит
git commit -m "Deploy updated version to GitHub Pages"

# Отправить изменения
git push origin gh-pages
```

### Важные замечания

#### Конфигурация путей
- **vite.config.ts:** `base: mode === "production" ? "/" : "/"`
- **App.tsx:** `<BrowserRouter>` (без basename)
- **Ассеты:** Должны быть в `/assets/` относительно корня

#### Структура файлов в ветке gh-pages
```
gh-pages/
├── index.html          # Главный HTML файл
├── assets/            # Папка с ассетами
│   ├── index-XXX.js   # JavaScript файлы
│   └── index-XXX.css  # CSS файлы
└── (другие файлы)
```

#### Поиск и устранение неисправностей

##### 404 ошибки для ассетов
**Симптомы:**
- Ошибки в консоли: `Failed to load resource: the server responded with a status of 404`
- Белый экран на сайте
- Неправильные пути в HTML

**Решение:**
1. Проверить пути в `index.html` - должны быть `/assets/...`
2. Проверить конфигурацию в `vite.config.ts`
3. Пересобрать проект: `bun run build`
4. Обновить файлы в ветке `gh-pages`

##### Проблемы с кэшированием
**Симптомы:**
- Сайт показывает старую версию после обновления
- Ассеты доступны по прямым URL, но не загружаются через сайт

**Решение:**
1. Очистить кэш браузера
2. Подождать 5-10 минут для обновления GitHub Pages
3. Принудительно обновить коммит с изменениями

##### Проверка развертывания
```bash
# Проверить статус ветки
git status

# Проверить последние коммиты
git log --oneline -5

# Проверить содержимое index.html в git
git show HEAD:index.html

# Проверить доступность ассетов
curl -I https://nexus-32.github.io/assets/index-CMvAhhg6.css
curl -I https://nexus-32.github.io/assets/index-CaWSl7i-.js
```

### Автоматизация (опционально)

#### GitHub Actions
Можно создать `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Скрипт развертывания
Создать `deploy.sh`:
```bash
#!/bin/bash
set -e

echo "Building project..."
bun run build

echo "Switching to gh-pages branch..."
git checkout gh-pages

echo "Copying build files..."
Copy-Item -Path 'dist\*' -Destination '.' -Force -Recurse

echo "Adding files to git..."
git add index.html assets/

echo "Committing changes..."
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"

echo "Pushing to GitHub..."
git push origin gh-pages

echo "Switching back to main branch..."
git checkout main

echo "Deployment completed!"
```

### Частые проблемы и решения

| Проблема | Причина | Решение |
|---------|--------|--------|
| 404 для CSS/JS | Неправильные пути в index.html | Исправить пути на `/assets/` |
| Белый экран | Отсутствуют ассеты или ошибки JS | Проверить консоль браузера |
| Старая версия сайта | Кэш GitHub Pages | Очистить кэш, подождать |
| Ошибки сборки | Проблемы с зависимостями | `bun install`, проверить package.json |

### Контакты и ресурсы
- **GitHub Pages Documentation:** https://docs.github.com/en/pages
- **Vite Documentation:** https://vitejs.dev/guide/build#public-base-path
- **React Router:** https://reactrouter.com/en/main

---

*Последнее обновление: 19 декабря 2025*
