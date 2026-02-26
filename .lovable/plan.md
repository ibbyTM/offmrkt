

## Remove Download Button from Compliance Documents

### Change

**File: `src/components/property-detail/ComplianceDocuments.tsx`**

Remove the download button that appears next to available compliance documents. The button currently shows a Download icon but has no actual download functionality, so it should be removed to avoid confusion.

### Technical Detail

Remove the conditional block (lines 43-47) that renders the `<button>` with the `<Download>` icon when `isAvailable` is true. Also remove the `Download` import from lucide-react since it will no longer be used.

