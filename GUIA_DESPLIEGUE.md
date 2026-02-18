# Guía de Despliegue en GitHub Pages

Sigue estos pasos para subir tu proyecto a GitHub y publicarlo en GitHub Pages.

## 1. Preparar el Repositorio

Asegúrate de que estás en la carpeta de tu proyecto.

1.  Abre una terminal en la carpeta de tu proyecto (`Presentacion`).
2.  Si no has inicializado git, ejecuta:
    ```bash
    git init
    ```
3.  Añade todos los archivos:
    ```bash
    git add .
    ```
4.  Haz el primer commit:
    ```bash
    git commit -m "Initial commit: Portfolio with profile pic fix"
    ```

## 2. Crear el Repositorio en GitHub

1.  Ve a [github.com/new](https://github.com/new).
2.  Nombre del repositorio: **Presentation** (Es importante que sea eL mismo nombre que configuramos en `vite.config.ts`).
3.  Déjalo como **Público**.
4.  No marques ninguna casilla de inicialización (README, gitignore, license).
5.  Haz clic en **Create repository**.

## 3. Subir el Código

Copia los comandos que te da GitHub en la sección "...or push an existing repository from the command line". Deberían ser algo así (reemplaza `TU_USUARIO` con tu usuario de GitHub):

```bash
git remote add origin https://github.com/TU_USUARIO/Presentation.git
git branch -M main
git push -u origin main
```

## 4. Activar GitHub Pages

1.  En tu repositorio de GitHub, ve a **Settings** (pestaña superior derecha).
2.  En el menú de la izquierda, busca la sección **Pages**.
3.  En "Build and deployment", selecciona **Source** como "Deploy from a branch".
4.  En "Branch", selecciona **main** y la carpeta **/(root)**.
5.  Haz clic en **Save**.

## 5. Verificar

Espera unos minutos. GitHub te mostrará un enlace en la parte superior de la página de configuración de Pages (algo como `https://tu-usuario.github.io/Presentation/`).

¡Haz clic y deberías ver tu portafolio funcionando con tu foto de perfil!

---

> **Nota:** Si en algún momento cambias el nombre del repositorio, recuerda actualizar también la propiedad `base` en el archivo `vite.config.ts`.
