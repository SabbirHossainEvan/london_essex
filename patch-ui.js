const fs = require('fs');

function patch() {
    const path = 'd:/evan/london_essex/components/dashboard/am2-registration-flow.tsx';
    if (!fs.existsSync(path)) return;
    let code = fs.readFileSync(path, 'utf8');

    // 1. Add state
    if (!code.includes('sessionUploadedDocIds')) {
        code = code.replace(
            'const [uploadingDocumentId, setUploadingDocumentId] = React.useState<string | null>(null);',
            'const [uploadingDocumentId, setUploadingDocumentId] = React.useState<string | null>(null);\n  const [sessionUploadedDocIds, setSessionUploadedDocIds] = React.useState<string[]>([]);'
        );
    }

    // 2. Update handleUploadDocument
    if (!code.includes('setSessionUploadedDocIds((prev)')) {
        code = code.replace(
            /file,\s*\}\).unwrap\(\);/,
            'file,\n      }).unwrap();\n\n      setSessionUploadedDocIds((prev) => [...prev, id]);'
        );
    }

    // 3. Update merging logic
    const findMerge = /const requirements = \[\.\.\.screen.requirements\];\s*extraDocs.forEach\(\(doc\) => \{\s*if \(!requirements.some\(\(r\) => r.id === doc.id\)\) \{\s*requirements.push\(doc\);\s*\}\s*\}\);/;
    // Wait, the file currently has:
    /*
    4130:                   const requirements = [...screen.requirements];
    4131:                   extraDocs.forEach(doc => {
    4132:                     if (!requirements.some(r => r.id === doc.id)) {
    4133:                       requirements.push(doc);
    4134:                     }
    4135:                   });
    */
    const findMergeLiteral = `const requirements = [...screen.requirements];
                  extraDocs.forEach(doc => {
                    if (!requirements.some(r => r.id === doc.id)) {
                      requirements.push(doc);
                    }
                  });`;
                  
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

    if (code.includes(findMergeLiteral)) {
        code = code.replace(findMergeLiteral, replaceMerge);
    } else {
        console.warn('Merge block not found');
    }

    fs.writeFileSync(path, code);
    console.log('Patched am2-registration-flow.tsx');
}

patch();
