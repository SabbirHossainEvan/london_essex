const fs = require('fs');

function updateUI() {
  const path = 'd:/evan/london_essex/components/dashboard/am2-registration-flow.tsx';
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');

  // Regex to match uploadBookingDocument call and inject flow
  const pattern = /uploadBookingDocument\(\{\s*bookingId:\s*resolvedBookingId,/;
  const replacement = 'uploadBookingDocument({\n        bookingId: resolvedBookingId,\n        flow: netFlowType,';

  if (!pattern.test(code)) {
      console.warn('Regex failed for UI');
  }

  code = code.replace(pattern, replacement);

  fs.writeFileSync(path, code);
  console.log('Updated UI via Regex');
}

updateUI();
