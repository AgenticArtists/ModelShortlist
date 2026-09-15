import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/coding-agents'

export const metadata: Metadata = {
  title: 'Best AI Models for Coding Agents',
  description: 'Choose AI models for coding agents using current context, tool-calling, pricing, and benchmark evidence instead of a static leaderboard.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Best AI Models for Coding Agents | ModelShortlist',
    description: 'Use workload-specific evidence to shortlist models for autonomous and agentic coding work.',
  },
}

export default function CodingAgentsPage() {
  return (
    <UseCaseLanding
      eyebrow="AI models for coding agents"
      title="Choose a coding model for"
      gradientTitle="the agent you are actually running."
      description="Autonomous coding changes the model-selection problem. Tool reliability, context, output cost, agentic performance, and long-running economics can matter more than a single benchmark score."
      intro="A model that is excellent for a short interactive coding question may be a poor choice for dozens of parallel subagents or a long-running repository task. The right shortlist depends on how much autonomy you need, how often tools are called, how large the working context becomes, and how much output the agent generates."
      decisionFactors={[
        'Tool/function-calling support and the reliability needed for repeated agent actions.',
        'Context capacity for repository state, plans, tool results, and long-running histories.',
        'Coding and agentic benchmark evidence when a verified Artificial Analysis match is available.',
        'Input/output pricing, especially when many subagents or long traces multiply token usage.',
      ]}
      prompts={[
        'I need the best-value model for a long-running autonomous coding agent. Tool calling is required and I need at least 100k context.',
        'What is the cheapest model I would trust with repetitive coding subagents while preserving reliable tool use?',
        'Quality matters more than cost for this repository refactor, but I still want to know whether the frontier premium is justified.',
      ]}
      whyModelShortlist={[
        'Starts from the current OpenRouter model catalog rather than a fixed list of fashionable coding models.',
        'Can enforce tool calling, minimum context, creator filters, and price ceilings as hard constraints.',
        'Attaches Artificial Analysis coding, intelligence, and agentic metrics only when the model identity can be matched confidently.',
        'Leaves the final weighting to the host AI so an autonomous agent, cheap subagent, and interactive coding assistant can produce different recommendations.',
      ]}
    />
  )
}
