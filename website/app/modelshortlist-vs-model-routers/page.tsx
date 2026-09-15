import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/modelshortlist-vs-model-routers'

export const metadata: Metadata = {
  title: 'ModelShortlist vs AI Model Routers',
  description: 'ModelShortlist recommends models using current evidence; model routers choose or dispatch inference at runtime. Learn where the two approaches differ.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'ModelShortlist vs AI Model Routers',
    description: 'Recommendation and runtime routing solve different model-selection problems.',
  },
}

export default function ModelRoutersPage() {
  return (
    <EducationLanding
      eyebrow="ModelShortlist vs model routers"
      title="ModelShortlist recommends."
      gradientTitle="It does not route inference."
      description="Model routers and ModelShortlist can both help with model choice, but they operate at different points in the stack. ModelShortlist gives your host AI current evidence for an explicit workload; it does not sit in the inference path."
      keyPoints={[
        'ModelShortlist is a local read-only MCP context layer, not an inference proxy.',
        'A router may dispatch individual requests automatically at runtime.',
        'ModelShortlist is useful when a human or AI wants an explainable shortlist before choosing a model.',
        'The local/BYOK architecture keeps ModelShortlist out of the model traffic path.',
      ]}
      sections={[
        {
          heading: 'What ModelShortlist does',
          body: 'The MCP retrieves current model facts, attaches independent Artificial Analysis evidence when identities match confidently, applies explicit hard constraints, and returns enough context for the host AI to explain a shortlist.',
          bullets: [
            'No hosted ModelShortlist inference endpoint.',
            'No automatic request-by-request model switching.',
            'No permanent global score that overrides workload context.',
          ],
        },
        {
          heading: 'What a model router typically does',
          body: 'A router usually participates in the runtime path and chooses where a request should be sent based on routing logic, policy, availability, cost, quality, or other signals. That can be valuable when automatic dispatch is the product requirement.',
        },
        {
          heading: 'When ModelShortlist is the better fit',
          body: 'Use ModelShortlist when you want an evidence-backed recommendation you can inspect before configuring an agent, application, workflow, or provider. The result can inform a router configuration later, but ModelShortlist itself does not become the router.',
        },
      ]}
      prompts={[
        'I am choosing a default model for this coding agent. Shortlist the best current options and explain the tradeoffs before I configure routing.',
        'Compare these OpenRouter models for my workload and tell me which hard constraints eliminate candidates.',
        'I already have a router. Which models should be in its candidate pool for this workload, based on current benchmark and operational evidence?',
      ]}
      relatedLinks={[
        { href: '/why-modelshortlist', title: 'Why ModelShortlist exists', description: 'Understand the workload-specific recommendation philosophy.' },
        { href: '/openrouter-model-comparison', title: 'OpenRouter model comparison', description: 'Use current OpenRouter facts to build a shortlist without routing inference.' },
        { href: '/modelshortlist-vs-static-leaderboards', title: 'ModelShortlist vs leaderboards', description: 'See the difference between evidence, ranking, and workload judgment.' },
      ]}
    />
  )
}
