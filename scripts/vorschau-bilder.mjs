// Nur für die lokale Vorschau: verknüpft dist/wp-content/uploads mit uploadsRoot/,
// damit die WordPress-Bilder angezeigt werden. Beim Hochladen wird wp-content/ ausgeschlossen.
import fs from 'node:fs';
fs.mkdirSync('dist/wp-content', { recursive: true });
fs.rmSync('dist/wp-content/uploads', { force: true, recursive: false });
fs.symlinkSync('../../uploadsRoot', 'dist/wp-content/uploads');
console.log('Vorschau: Bilder aus uploadsRoot/ verknüpft.');
