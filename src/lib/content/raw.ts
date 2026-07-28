import contact from '../../data/contact.json'
import education from '../../data/education.json'
import experience from '../../data/experience.json'
import profile from '../../data/profile.json'
import projects from '../../data/projects.json'
import site from '../../data/site.json'
import skills from '../../data/skills.json'
import writing from '../../data/writing.json'

/** Raw JSON bag — validated in CI / `npm run validate:content`, not on every page load. */
export function getRawPortfolioData() {
  return {
    site,
    profile,
    skills,
    experience,
    projects,
    education,
    writing,
    contact,
  }
}
