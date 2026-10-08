/**
 * Data Projection Functions
 * Transforms raw API responses into clean display-ready shapes,
 * stripping MongoDB metadata (_id, __v, createdAt, updatedAt).
 */

/**
 * Normalizes a single project object to use canonical field names.
 * Resolves backend schema inconsistencies so components don't need
 * to check both `github` and `githubUrl`, etc.
 *
 * Canonical fields:
 *   id, featured, github, liveDemo, figmaLink, tech
 *
 * The original variant fields are preserved for backward compat
 * with the backend API contract (ProjectForm sends both on save).
 */
export function normalizeProject(project) {
  if (!project || typeof project !== 'object') return project;

  const id = project.id || project._id || '';
  const featured = Boolean(project.featured || project.isFeatured);
  const github = project.github || project.githubUrl || '';
  const liveDemo = project.liveDemo || project.liveUrl || '';
  const figmaLink = project.figmaLink || project.figmaUrl || '';
  const tech = Array.isArray(project.tech)
    ? project.tech
    : Array.isArray(project.techStack)
      ? project.techStack
      : [];

  return {
    ...project,
    id,
    _id: project._id || id,
    featured,
    isFeatured: featured,
    github,
    githubUrl: github,
    liveDemo,
    liveUrl: liveDemo,
    figmaLink,
    figmaUrl: figmaLink,
    tech,
    techStack: tech,
  };
}

/**
 * Normalizes an array of projects.
 */
export function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return [];
  return projects.map(normalizeProject);
}

/**
 * GET /profile -> Contains ONLY education and technical_core.
 * Strictly excludes _id, name, title, primary_focus, status, createdAt, updatedAt, __v.
 */
export function getProfileData(raw) {
  return {
    education: raw?.education || {
      institute: "Higher Institute of Computer Science and Information Systems (HICIS)",
      location: "6th of October City, Egypt",
      level: "Level 04 (Senior Year)",
      major: "Computer Science",
    },
    technical_core: raw?.technical_core || {
      backend: [
        "Node.js",
        "Express.js",
        "TypeScript",
        "RESTful APIs",
        "JWT & Authentication",
      ],
      databases: [
        "SQL",
        "NoSQL",
        "MySQL",
        "MongoDB",
        "Mongoose",
      ],
      systems_foundation: [
        "C++",
        "Object-Oriented Programming",
        "Data Structures",
        "Algorithms & Problem Solving",
      ],
      exploratory: [
        "Redis",
        "Computer Vision Fundamentals",
        "Modern UI Essentials",
        "Flutter",
      ],
    },
  };
}

/**
 * GET /projects -> Contains ONLY projects data.
 * Strips MongoDB metadata (_id, __v, createdAt, updatedAt).
 */
export function getProjectsData(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(({ _id, __v, createdAt, updatedAt, ...project }) => {
    if (Array.isArray(project.metrics)) {
      return {
        ...project,
        metrics: project.metrics.map(({ _id: mId, ...m }) => m),
      };
    }
    return project;
  });
}

/**
 * GET /skills -> Contains ONLY skills data.
 * Strips MongoDB metadata (_id, __v, createdAt, updatedAt).
 */
export function getSkillsData(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const { _id, __v, createdAt, updatedAt, ...cleanSkills } = raw;
  return cleanSkills;
}

/**
 * GET /status -> Contains ONLY status data.
 * Strips MongoDB metadata (_id, __v, createdAt, updatedAt).
 */
export function getStatusData(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const { _id, __v, createdAt, updatedAt, ...cleanStatus } = raw;
  return cleanStatus;
}
