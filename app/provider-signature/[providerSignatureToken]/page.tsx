import ProviderSignatureUploadPage from "@/components/dashboard/provider-signature-upload-page";

export default async function Page({
  params,
}: {
  params: Promise<{ providerSignatureToken: string }>;
}) {
  const { providerSignatureToken } = await params;

  return <ProviderSignatureUploadPage token={providerSignatureToken} />;
}
