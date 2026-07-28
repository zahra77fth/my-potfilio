import { z } from 'zod'

/** Empty string = hidden link (projects, articles, contact info). */
const optionalUrl = z.string()

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const siteDataSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  email: z.string().min(1),
  location: z.string().min(1),
  availability: z.string().min(1),
  domain: z.string(),
  resumeUrl: z.string(),
  social: z.object({
    github: z.string(),
    linkedin: z.string(),
    twitter: z.string(),
    dribbble: z.string(),
  }),
  navigation: z.array(navItemSchema).min(1),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    keywords: z.string(),
    ogImage: z.string().min(1),
  }),
})

export const profileDataSchema = z.object({
  hero: z.object({
    greeting: z.string().min(1),
    rotatingRoles: z.array(z.string().min(1)).optional(),
    headline: z.string().min(1),
    ctaPrimary: z.object({ label: z.string().min(1), href: z.string().min(1) }),
    ctaSecondary: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  }),
  about: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    highlights: z.array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    ),
    image: z.object({
      src: z.string().min(1),
      alt: z.string().min(1),
    }),
  }),
})

export const skillsDataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  categories: z
    .array(
      z.object({
        name: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
})

export const experienceItemSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  achievements: z.array(z.string().min(1)),
  technologies: z.array(z.string().min(1)),
})

export const experienceDataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  items: z.array(experienceItemSchema).min(1),
})

export const projectItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  links: z.object({
    live: optionalUrl,
    github: optionalUrl,
  }),
  featured: z.boolean(),
})

export const projectsDataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  items: z.array(projectItemSchema).min(1),
})

export const educationDataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  items: z
    .array(
      z.object({
        degree: z.string().min(1),
        school: z.string().min(1),
        period: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
  certifications: z.array(
    z.object({
      name: z.string().min(1),
      issuer: z.string().min(1),
      year: z.string().min(1),
    }),
  ),
})

/** Section chrome for homepage Writing — article bodies live in content/articles/*.mdx */
export const writingDataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
})

export const contactDataSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  form: z.object({
    nameLabel: z.string().min(1),
    emailLabel: z.string().min(1),
    subjectLabel: z.string().min(1),
    messageLabel: z.string().min(1),
    submitLabel: z.string().min(1),
    successMessage: z.string().min(1),
    topics: z.array(z.string().min(1)).min(1),
  }),
  info: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
      href: optionalUrl,
    }),
  ),
  faq: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ),
})

export const portfolioDataSchema = z.object({
  site: siteDataSchema,
  profile: profileDataSchema,
  skills: skillsDataSchema,
  experience: experienceDataSchema,
  projects: projectsDataSchema,
  education: educationDataSchema,
  writing: writingDataSchema,
  contact: contactDataSchema,
})

export type SiteData = z.infer<typeof siteDataSchema>
export type ProfileData = z.infer<typeof profileDataSchema>
export type SkillsData = z.infer<typeof skillsDataSchema>
export type ExperienceItem = z.infer<typeof experienceItemSchema>
export type ExperienceData = z.infer<typeof experienceDataSchema>
export type ProjectItem = z.infer<typeof projectItemSchema>
export type ProjectsData = z.infer<typeof projectsDataSchema>
export type EducationData = z.infer<typeof educationDataSchema>
export type WritingData = z.infer<typeof writingDataSchema>
export type ContactData = z.infer<typeof contactDataSchema>
export type PortfolioData = z.infer<typeof portfolioDataSchema>

export function parsePortfolioData(input: unknown): PortfolioData {
  return portfolioDataSchema.parse(input)
}

export function formatContentValidationError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
  }
  return error instanceof Error ? error.message : String(error)
}
