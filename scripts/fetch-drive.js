
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Configuración
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'scripts', 'service-account.json');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'certificates.json');
// ID de la carpeta compartido por el usuario. Si no existe en ENV, usar un valor dummy o fallar.
const FOLDER_ID = process.env.GDRIVE_FOLDER_ID;

async function fetchCertificates() {
    console.log('🚀 Iniciando sincronización con Google Drive...');

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error(`❌ Error: No se encontró el archivo de credenciales en ${CREDENTIALS_PATH}`);
        process.exit(1);
    }

    if (!FOLDER_ID) {
        console.error('❌ Error: No se ha definido GDRIVE_FOLDER_ID en el archivo .env');
        process.exit(1);
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });

    const portfolioData = {
        profileImage: '',
        cvLink: '',
        certificates: []
    };

    /**
     * Recursively fetch files from a folder
     * @param {string} folderId 
     * @param {string} categoryName 
     */
    async function processFolder(folderId, categoryName = 'General') {
        try {
            console.log(`📂 Procesando carpeta: ${categoryName} (ID: ${folderId})...`);

            const res = await drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, webViewLink, webContentLink, thumbnailLink, createdTime)',
                orderBy: 'createdTime desc',
                pageSize: 100,
            });

            const files = res.data.files || [];

            for (const file of files) {
                const nameLower = file.name.toLowerCase();

                // 1. Detectar Carpetas (Categorías)
                if (file.mimeType === 'application/vnd.google-apps.folder') {
                    // Si encontramos una carpeta dentro de la raíz, su nombre será la categoría
                    await processFolder(file.id, file.name);
                }
                // 2. Detectar CV
                else if (nameLower.includes('cv') || nameLower.includes('curriculum') || nameLower.includes('resume')) {
                    console.log(`📄 CV detectado: ${file.name}`);
                    portfolioData.cvLink = file.webViewLink;
                }
                // 3. Detectar Foto de Perfil
                else if (nameLower.includes('profile') || nameLower.includes('perfil')) { // Check specifically for image types if needed, but name check is usually enough
                    if (file.mimeType.startsWith('image/')) {
                        console.log(`👤 Foto de perfil detectada: ${file.name}`);
                        // Usamos webContentLink para descargar/mostrar directamente si es posible, o thumbnailLink hackeado para alta resolución
                        // Para drive, a veces webContentLink es mejor para <img> src si es público, pero thumbnailLink es más seguro con tokens.
                        // Vamos a intentar usar una versión de alta resolución del thumbnailLink.
                        if (file.thumbnailLink) {
                            portfolioData.profileImage = file.thumbnailLink.replace('=s220', '=s1000'); // Tratar de pedir imagen grande
                        } else {
                            portfolioData.profileImage = file.webContentLink;
                        }
                    }
                }
                // 4. Es un certificado (archivo regular en carpeta o raíz)
                else {
                    portfolioData.certificates.push({
                        ...file,
                        category: categoryName
                    });
                }
            }

        } catch (error) {
            console.error(`❌ Error procesando carpeta ${categoryName}:`, error.message);
        }
    }

    await processFolder(FOLDER_ID);

    if (portfolioData.certificates.length === 0) {
        console.log('⚠️ No se encontraron certificados.');
    } else {
        console.log(`✅ Se procesaron ${portfolioData.certificates.length} certificados.`);
    }

    // Asegurar directorio de salida
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(portfolioData, null, 2));
    console.log(`💾 Datos guardados en ${OUTPUT_FILE}`);
}

fetchCertificates();
