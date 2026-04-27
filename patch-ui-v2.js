const fs = require('fs');

function patch() {
    const path = 'd:/evan/london_essex/components/dashboard/am2-registration-flow.tsx';
    if (!fs.existsSync(path)) return;
    let code = fs.readFileSync(path, 'utf8');

    // 3. Update merging logic via regex
    const pattern = /const requirements = \[\.\.\.screen\.requirements\];\s*extraDocs\.forEach\((doc|(\(doc\)))\s*=>\s*\{[\s\S]*?requirements\.push\(doc\);[\s\S]*?\}\);/;
    
    const replaceMerge = `const requirements = [...screen.requirements];
                  extraDocs.forEach((doc) => {
                    const existing = requirements.find((r) => r.id === doc.id);
                    if (!existing) {
                      requirements.push({
                        ...doc,
                        uploaded: doc.uploaded || sessionUploadedDocIds.includes(doc.id),
                      });
                    }
                  });`;

    if (pattern.test(code)) {
        code = code.replace(pattern, replaceMerge);
        console.log('Merge block patched');
    } else {
        console.warn('Merge block regex failed');
    }

    fs.writeFileSync(path, code);
}

patch();
