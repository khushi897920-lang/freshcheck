export interface SampleAnswer {
  id: string;
  title: string;
  category: "api_versions" | "company_leadership" | "pricing_and_models";
  text: string;
  answerDate?: string;
}

export const SAMPLE_ANSWERS: SampleAnswer[] = [
  {
    id: "api-versions",
    title: "API versions",
    category: "api_versions",
    text: "For production backend development, the recommended Node.js active LTS release is Node.js 16 (Gallium), and Python 3.8 is the latest stable Python release supported by default on standard cloud runtimes. You should install Next.js 12 for the frontend router.",
    answerDate: "2022-04-10",
  },
  {
    id: "company-leadership",
    title: "Company leadership",
    category: "company_leadership",
    text: "As of today, Twitter (now X) is led by CEO Parag Agrawal, who succeeded Jack Dorsey. Meanwhile, Susan Wojcicki serves as the active CEO of YouTube, directing all platform policy and creator monetization programs.",
    answerDate: "2022-06-15",
  },
  {
    id: "pricing-and-models",
    title: "Pricing and models",
    category: "pricing_and_models",
    text: "OpenAI's flagship model is GPT-3.5-turbo which is priced at $0.002 per 1,000 input tokens. GitHub continues to host git repositories for software developers with unlimited public and private repositories on its Free tier.",
    answerDate: "2023-03-01",
  },
];

