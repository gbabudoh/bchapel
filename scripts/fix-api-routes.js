// Fix API route destructuring patterns
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

// Specific destructuring fixes for API routes
const destructureReplacements = [
  // Destructured variable names in const { ... } = await request.json()
  [/\bconst\s*\{([^}]*)\bis_active\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\bis_active\b/g, 'isActive');
  }],
  [/\bconst\s*\{([^}]*)\bis_featured\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\bis_featured\b/g, 'isFeatured');
  }],
  [/\bconst\s*\{([^}]*)\bimage_url\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\bimage_url\b/g, 'imageUrl');
  }],
  [/\bconst\s*\{([^}]*)\bbutton_text\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\bbutton_text\b/g, 'buttonText');
  }],
  [/\bconst\s*\{([^}]*)\bbutton_url\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\bbutton_url\b/g, 'buttonUrl');
  }],
  [/\bconst\s*\{([^}]*)\border_index\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\border_index\b/g, 'orderIndex');
  }],
  [/\bconst\s*\{([^}]*)\balt_text\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\balt_text\b/g, 'altText');
  }],
  [/\bconst\s*\{([^}]*)\bsuggested_amounts\b([^}]*)\}\s*=\s*await\s+request\.json\(\)/g, (match) => {
    return match.replace(/\bsuggested_amounts\b/g, 'suggestedAmounts');
  }],
];

// After fixing destructuring, fix remaining bare references used as variables
const variableReplacements = [
  [/\bis_active\b(?!\s*[=:])/g, 'isActive'],
  [/\bis_featured\b(?!\s*[=:])/g, 'isFeatured'],
  [/\bimage_url\b(?!\s*[=:])/g, 'imageUrl'],
  [/\bbutton_text\b(?!\s*[=:])/g, 'buttonText'],
  [/\bbutton_url\b(?!\s*[=:])/g, 'buttonUrl'],
  [/\border_index\b(?!\s*[=:])/g, 'orderIndex'],
  [/\balt_text\b(?!\s*[=:])/g, 'altText'],
  [/\bsuggested_amounts\b(?!\s*[=:])/g, 'suggestedAmounts'],
];

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

walkDir(apiDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  
  // Apply destructuring fixes
  for (const [pattern, replacer] of destructureReplacements) {
    content = content.replace(pattern, replacer);
  }
  
  // Apply variable reference fixes (only for remaining snake_case vars)
  // Need to be careful: only replace in Prisma data blocks, not in column mappings
  // Let's be more targeted: find lines like `orderIndex: order_index` and fix them
  content = content.replace(/orderIndex:\s*order_index/g, 'orderIndex: orderIndex');
  content = content.replace(/isActive:\s*is_active/g, 'isActive: isActive');
  content = content.replace(/isFeatured:\s*is_featured/g, 'isFeatured: isFeatured');
  content = content.replace(/imageUrl:\s*image_url/g, 'imageUrl: imageUrl');
  content = content.replace(/buttonText:\s*button_text/g, 'buttonText: buttonText');
  content = content.replace(/buttonUrl:\s*button_url/g, 'buttonUrl: buttonUrl');
  content = content.replace(/altText:\s*alt_text/g, 'altText: altText');
  content = content.replace(/suggestedAmounts:\s*suggested_amounts/g, 'suggestedAmounts: suggestedAmounts');
  
  // Simplify redundant assignments like `isActive: isActive` -> just `isActive`
  // Actually, let's keep them explicit for clarity
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesChanged++;
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`\n🎉 Fixed ${filesChanged} API route files.`);
