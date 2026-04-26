const fs = require('fs');

function updateUI() {
  const path = 'd:/evan/london_essex/components/dashboard/am2-registration-flow.tsx';
  if (!fs.existsSync(path)) {
      console.error('File not found');
      return;
  }
  let code = fs.readFileSync(path, 'utf8');

  // 1. Update Title
  const titleFind = `<h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#2d3f8f]">\n              {course.title}\n            </h1>`;
  const titleReplace = `<h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#2d3f8f]">\n              {netFlowType === "am2e" || netFlowType === "am2e-v1" ? "AM2E Assessment Preparation" : course.title}\n            </h1>`;
  
  if (code.includes(titleFind)) {
      code = code.replace(titleFind, titleReplace);
  } else {
      console.warn("Could not find title block");
  }

  // 2. Update Documents Panel
  const panelFind = `<NetDocumentsPanel\n                  screen={documentsScreenData.data.screen}`;
  const panelReplace = `{\n                  (() => {\n                    const screenReqs = documentsScreenData.data.screen.requirements;\n                    const isAm2e = netFlowType === "am2e" || netFlowType === "am2e-v1";\n                    const extraDocs = isAm2e ? [\n                      {\n                        id: "am2e_checklist_document",\n                        title: "AM2E Checklist Document",\n                        description: "Please upload your completed AM2E Checklist.",\n                        uploaded: false,\n                        document: null,\n                      },\n                      {\n                        id: "am2e_employer_endorsement",\n                        title: "Employer Endorsement",\n                        description: "Please upload your employer endorsement document.",\n                        uploaded: false,\n                        document: null,\n                      }\n                    ] : [];\n                    \n                    const finalRequirements = [...screenReqs];\n                    extraDocs.forEach(doc => {\n                      if (!finalRequirements.some(r => r.id === doc.id)) {\n                        finalRequirements.push(doc);\n                      }\n                    });\n\n                    return (\n                      <NetDocumentsPanel\n                        screen={{ ...documentsScreenData.data.screen, requirements: finalRequirements }}`;

  if (code.includes(panelFind)) {
      code = code.replace(panelFind, panelReplace);
      
      // Close the IIFE
      const closeFind = `uploadError={documentUploadError}\n                />`;
      const closeReplace = `uploadError={documentUploadError}\n                      />\n                    );\n                  })()\n                }`;
      
      if (code.includes(closeFind)) {
          code = code.replace(closeFind, closeReplace);
      } else {
          console.warn("Could not find close block");
      }
  } else {
      console.warn("Could not find panel block");
  }

  fs.writeFileSync(path, code);
  console.log('Updated UI');
}

updateUI();
