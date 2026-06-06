const fs = require('fs');
const path = require('path');

const files = [
  'src/context/AuthContext.tsx',
  'src/app/predictor/page.tsx',
  'src/app/saved/page.tsx',
  'src/app/compare/page.tsx',
  'src/app/colleges/page.tsx',
  'src/app/colleges/[id]/page.tsx'
];

const API_VAR = "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}";

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace 'http://localhost:5000/api/...' with `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/...`
    content = content.replace(/'http:\/\/localhost:5000([^']+)'/g, '`' + API_VAR + '$1`');
    
    // Replace `http://localhost:5000/api/...` with `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/...`
    content = content.replace(/`http:\/\/localhost:5000([^`]+)`/g, '`' + API_VAR + '$1`');
    
    // Replace "http://localhost:5000/api/..." with `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/...`
    content = content.replace(/"http:\/\/localhost:5000([^"]+)"/g, '`' + API_VAR + '$1`');

    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  } else {
    console.error('File not found:', filePath);
  }
});
