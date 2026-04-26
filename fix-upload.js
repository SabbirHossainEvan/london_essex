const fs = require('fs');

function updateApi() {
  const path = 'd:/evan/london_essex/lib/redux/features/bookings/booking-api.ts';
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

  // Update UploadBookingDocumentRequest
  code = code.replace(
    'export type UploadBookingDocumentRequest = {\n  bookingId: string;',
    'export type UploadBookingDocumentRequest = {\n  bookingId: string;\n  flow?: string;'
  );

  // Update uploadBookingDocument mutation
  code = code.replace(
    'query: ({ bookingId, documentType, documentLabel, file }) => {',
    'query: ({ bookingId, flow, documentType, documentLabel, file }) => {'
  );
  
  // Find the uploadBookingDocument body and add flow if present
  const uploadMatch = code.match(/url: `\/bookings\/\${bookingId}\/flow\/documents\/upload`,/);
  if (uploadMatch) {
      const startOfReturn = code.lastIndexOf('return {', uploadMatch.index);
      if (startOfReturn !== -1) {
          code = code.slice(0, startOfReturn) + 
                 'const params = flow ? { flow } : undefined;\n        return {' + 
                 code.slice(startOfReturn + 8);
          
          // Re-find because index changed
          const newUploadMatch = code.match(/url: `\/bookings\/\${bookingId}\/flow\/documents\/upload`,/);
          code = code.slice(0, newUploadMatch.index + newUploadMatch[0].length) +
                 '\n          params,' +
                 code.slice(newUploadMatch.index + newUploadMatch[0].length);
      }
  }

  fs.writeFileSync(path, code);
  console.log('Updated API');
}

function updateUI() {
  const path = 'd:/evan/london_essex/components/dashboard/am2-registration-flow.tsx';
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');

  // Update handleUploadDocument call
  code = code.replace(
    'const response = await uploadBookingDocument({\n        bookingId: resolvedBookingId,',
    'const response = await uploadBookingDocument({\n        bookingId: resolvedBookingId,\n        flow: netFlowType,'
  );

  fs.writeFileSync(path, code);
  console.log('Updated UI');
}

updateApi();
updateUI();
