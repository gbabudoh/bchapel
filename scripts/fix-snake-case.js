// Script to find and fix snake_case property references in admin pages and API routes
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'src', 'app', 'admin');
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// Map of snake_case to camelCase replacements
const replacements = [
  // Property accessors (item.xxx, event.xxx, etc.)
  [/\.is_active/g, '.isActive'],
  [/\.is_featured/g, '.isFeatured'],
  [/\.image_url/g, '.imageUrl'],
  [/\.button_text/g, '.buttonText'],
  [/\.button_url/g, '.buttonUrl'],
  [/\.order_index/g, '.orderIndex'],
  [/\.is_read/g, '.isRead'],
  [/\.alt_text/g, '.altText'],
  [/\.file_path/g, '.filePath'],
  [/\.original_name/g, '.originalName'],
  [/\.file_size/g, '.fileSize'],
  [/\.mime_type/g, '.mimeType'],
  [/\.site_title/g, '.siteTitle'],
  [/\.site_description/g, '.siteDescription'],
  [/\.site_keywords/g, '.siteKeywords'],
  [/\.site_url/g, '.siteUrl'],
  [/\.google_analytics_id/g, '.googleAnalyticsId'],
  [/\.facebook_url/g, '.facebookUrl'],
  [/\.instagram_url/g, '.instagramUrl'],
  [/\.youtube_url/g, '.youtubeUrl'],
  [/\.twitter_url/g, '.twitterUrl'],
  [/\.og_image/g, '.ogImage'],
  [/\.contact_email/g, '.contactEmail'],
  [/\.contact_phone/g, '.contactPhone'],
  [/\.donor_email/g, '.donorEmail'],
  [/\.donor_name/g, '.donorName'],
  [/\.transaction_id/g, '.transactionId'],
  [/\.suggested_amounts/g, '.suggestedAmounts'],
  [/\.sandbox_mode/g, '.sandboxMode'],
  [/\.created_at/g, '.createdAt'],
  [/\.updated_at/g, '.updatedAt'],
  
  // Form data keys in state objects { key: value }
  [/\bis_active\b(?=\s*:|\s*,|\s*})/g, 'isActive'],
  [/\bis_featured\b(?=\s*:|\s*,|\s*})/g, 'isFeatured'],
  [/\bimage_url\b(?=\s*:|\s*,|\s*})/g, 'imageUrl'],
  [/\bbutton_text\b(?=\s*:|\s*,|\s*})/g, 'buttonText'],
  [/\bbutton_url\b(?=\s*:|\s*,|\s*})/g, 'buttonUrl'],
  [/\border_index\b(?=\s*:|\s*,|\s*})/g, 'orderIndex'],
  [/\bis_read\b(?=\s*:|\s*,|\s*})/g, 'isRead'],
  [/\balt_text\b(?=\s*:|\s*,|\s*})/g, 'altText'],
  [/\bfile_path\b(?=\s*:|\s*,|\s*})/g, 'filePath'],
  [/\boriginal_name\b(?=\s*:|\s*,|\s*})/g, 'originalName'],
  [/\bfile_size\b(?=\s*:|\s*,|\s*})/g, 'fileSize'],
  [/\bmime_type\b(?=\s*:|\s*,|\s*})/g, 'mimeType'],
  [/\bsite_title\b(?=\s*:|\s*,|\s*})/g, 'siteTitle'],
  [/\bsite_description\b(?=\s*:|\s*,|\s*})/g, 'siteDescription'],
  [/\bsite_keywords\b(?=\s*:|\s*,|\s*})/g, 'siteKeywords'],
  [/\bsite_url\b(?=\s*:|\s*,|\s*})/g, 'siteUrl'],
  [/\bgoogle_analytics_id\b(?=\s*:|\s*,|\s*})/g, 'googleAnalyticsId'],
  [/\bfacebook_url\b(?=\s*:|\s*,|\s*})/g, 'facebookUrl'],
  [/\binstagram_url\b(?=\s*:|\s*,|\s*})/g, 'instagramUrl'],
  [/\byoutube_url\b(?=\s*:|\s*,|\s*})/g, 'youtubeUrl'],
  [/\btwitter_url\b(?=\s*:|\s*,|\s*})/g, 'twitterUrl'],
  [/\bog_image\b(?=\s*:|\s*,|\s*})/g, 'ogImage'],
  [/\bcontact_email\b(?=\s*:|\s*,|\s*})/g, 'contactEmail'],
  [/\bcontact_phone\b(?=\s*:|\s*,|\s*})/g, 'contactPhone'],
  [/\bdonor_email\b(?=\s*:|\s*,|\s*})/g, 'donorEmail'],
  [/\bdonor_name\b(?=\s*:|\s*,|\s*})/g, 'donorName'],
  [/\btransaction_id\b(?=\s*:|\s*,|\s*})/g, 'transactionId'],
  [/\bsuggested_amounts\b(?=\s*:|\s*,|\s*})/g, 'suggestedAmounts'],
  [/\bsandbox_mode\b(?=\s*:|\s*,|\s*})/g, 'sandboxMode'],
  
  // Destructuring patterns { key } = ... (less common, be careful)
  // These need special handling for API routes
];

// Also need to fix API route destructuring
const apiReplacements = [
  [/\{\s*([^}]*)\bis_active\b([^}]*)\}/g, (match) => {
    return match.replace(/\bis_active\b/g, 'isActive');
  }],
  [/\{\s*([^}]*)\bis_featured\b([^}]*)\}/g, (match) => {
    return match.replace(/\bis_featured\b/g, 'isFeatured');
  }],
  [/\{\s*([^}]*)\bimage_url\b([^}]*)\}/g, (match) => {
    return match.replace(/\bimage_url\b/g, 'imageUrl');
  }],
  [/\{\s*([^}]*)\bbutton_text\b([^}]*)\}/g, (match) => {
    return match.replace(/\bbutton_text\b/g, 'buttonText');
  }],
  [/\{\s*([^}]*)\bbutton_url\b([^}]*)\}/g, (match) => {
    return match.replace(/\bbutton_url\b/g, 'buttonUrl');
  }],
  [/\{\s*([^}]*)\border_index\b([^}]*)\}/g, (match) => {
    return match.replace(/\border_index\b/g, 'orderIndex');
  }],
  [/\{\s*([^}]*)\balt_text\b([^}]*)\}/g, (match) => {
    return match.replace(/\balt_text\b/g, 'altText');
  }],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  let changeCount = 0;
  
  for (const [pattern, replacement] of replacements) {
    const matches = content.match(pattern);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(pattern, replacement);
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed ${changeCount} references in: ${path.relative(process.cwd(), filePath)}`);
  }
  
  return changeCount;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      callback(filePath);
    }
  }
}

let totalChanges = 0;
let filesChanged = 0;

console.log('🔍 Scanning admin pages...');
walkDir(adminDir, (filePath) => {
  const changes = processFile(filePath);
  if (changes > 0) {
    filesChanged++;
    totalChanges += changes;
  }
});

console.log('\n🔍 Scanning API routes...');
walkDir(apiDir, (filePath) => {
  const changes = processFile(filePath);
  if (changes > 0) {
    filesChanged++;
    totalChanges += changes;
  }
});

// Also scan components and other pages
const componentsDir = path.join(__dirname, '..', 'components');
console.log('\n🔍 Scanning components...');
walkDir(componentsDir, (filePath) => {
  const changes = processFile(filePath);
  if (changes > 0) {
    filesChanged++;
    totalChanges += changes;
  }
});

// Scan other pages (about, events, etc.)
const pagesDir = path.join(__dirname, '..', 'src', 'app');
console.log('\n🔍 Scanning pages...');
walkDir(pagesDir, (filePath) => {
  // Skip admin and api directories (already processed)
  if (filePath.includes('admin') || filePath.includes('api')) return;
  const changes = processFile(filePath);
  if (changes > 0) {
    filesChanged++;
    totalChanges += changes;
  }
});

console.log(`\n🎉 Done! Fixed ${totalChanges} references across ${filesChanged} files.`);
