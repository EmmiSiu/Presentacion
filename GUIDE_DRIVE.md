# Configuración de Google Drive para el Portafolio

Este proyecto utiliza un script (`scripts/fetch-drive.js`) para descargar automáticamente tus certificados, foto de perfil y CV desde una carpeta de Google Drive.

## Pasos para Configurar

### 1. Crear un Proyecto en Google Cloud y Service Account
*(Si ya lo hiciste, salta al paso 3)* (Ver instrucciones anteriores o buscar en Google "Create Service Account Google Drive API").
Asegúrate de tener el archivo `scripts/service-account.json`.

### 2. Estructura de Carpetas en Google Drive (IMPORTANTE)
Para que el script detecte las categorías, tu foto y tu CV, organiza tu carpeta de Drive así:

*   **Carpeta Principal** (La que compartes con la Service Account)
    *   `profile-pic.jpg` (Debe contener "profile" o "perfil" en el nombre).
    *   `CV_Emiliano.pdf` (Debe contener "cv", "curriculum" o "resume" en el nombre).
    *   **Carpeta Backend/** (Tus certificados de backend aquí).
    *   **Carpeta Frontend/** (Tus certificados de frontend aquí).
    *   **Carpeta Soft Skills/** (Otros certificados...).
    *   *(Cualquier archivo suelto en la raíz se marcará como categoría "General")*.

### 3. Compartir y Configurar ID
1.  Comparte la **Carpeta Principal** con el email de tu Service Account (Viewer/Lector).
2.  Copia el ID de la carpeta.
3.  En tu archivo `.env`:
    ```env
    GDRIVE_FOLDER_ID=tu_id_de_carpeta_aqui
    ```

### 4. Ejecutar el Script
Para actualizar el portafolio con los datos de Drive:

```bash
node scripts/fetch-drive.js
```

El script generará `src/data/certificates.json` con:
*   Tu foto de perfil (para la sección "Sobre mí").
*   Enlace a tu CV (aparecerá un botón "Descargar CV").
*   Tus certificados agrupados por las carpetas que creaste.
