import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/document-extraction-models'

export const metadata: Metadata = {
  title: 'Best AI Models for Document Extraction',
  description: 'Choose AI models for document extraction using current context, structured-output capability, benchmark evidence, and input/output pricing.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Best AI Models for Document Extraction | ModelShortlist',
    description: 'Shortlist current models for extraction workloads without relying on a static top-10 list.',
  },
}

export default function DocumentExtractionModelsPage() {
  return (
    <UseCaseLanding
      eyebrow="AI models for document extraction"
      title="Choose an extraction model for"
      gradientTitle="the documents and economics you actually have."
      description="Document extraction is often less about buying the most capable frontier model and more about finding reliable structured output, enough context, acceptable error rates, and token economics that survive volume."
      intro="A small batch of messy contracts, a million short receipts, and long regulatory filings are different model-selection problems. The right shortlist depends on document length, schema complexity, tolerance for retries, expected output volume, and whether tool or structured-output support is mandatory."
      decisionFactors={[
        'Context capacity for the largest documents or multi-document batches you plan to send.',
        'Structured-output and tool support when extraction must conform to a strict schema or downstream workflow.',
        'Quality evidence appropriate to reasoning-heavy versus repetitive extraction tasks.',
        'Input and output pricing at the actual document volume, including retry and validation overhead.',
      ]}
      prompts={[
        'I need structured extraction from thousands of long documents. Reliability matters, but output cost needs to stay low. What should I shortlist?',
        'Compare current models for extracting a strict JSON schema from contracts up to 80k tokens each.',
        'I have a high-volume OCR-to-LLM pipeline. Which current models give me the best balance of extraction quality and token economics?',
      ]}
      whyModelShortlist={[
        'Starts from the current OpenRouter catalog rather than a fixed list of document models.',
        'Can apply minimum context, tool support, creator, and price ceilings before the host AI weighs softer tradeoffs.',
        'Uses Artificial Analysis evidence when the exact model can be reconciled confidently, without fabricating scores for unmatched models.',
        'Keeps price and capability facts current enough for workloads where a small per-token difference multiplies across large document volumes.',
      ]}
    />
  )
}
