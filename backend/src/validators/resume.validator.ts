import { z } from "zod"

// Shape of a resume coming from the client (manual form) or from the LLM parser.
// Objects strip unknown keys, so a client can never set columns we didn't list here
// (e.g. `id`, `resumeId`, `userId`, `createdAt`) on any row we create.

const MAX_ITEMS = 50

// Optional free-text field: trims, turns "" into null, caps length.
const text = (max: number) =>
    z.string().trim().max(max).nullish().transform((v) => (v ? v : null))

const shortText = text(200)
const url = text(500)
const longText = text(5000)
const date = text(50) // dates are stored as free-form strings ("2023-08-01", "Aug 2023", "Present")

const list = <T extends z.ZodType>(item: T, max = MAX_ITEMS) =>
    z.array(item).max(max).nullish().transform((v) => v ?? [])

const educationSchema = z.object({
    instituteName: shortText,
    level: shortText,
    startDate: date,
    endDate: date,
    location: shortText,
    degree: shortText,
    branch: shortText,
    grade: text(50),
})

const experienceSchema = z.object({
    companyName: shortText,
    location: shortText,
    // Required in the DB schema (no default), so a missing type is a 400 here rather than a DB error.
    type: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "RESEARCH", "VOLUNTEER"]),
    startDate: date,
    endDate: date,
    position: shortText,
    description: longText,
    proofLink: url,
})

const projectSchema = z.object({
    projectName: shortText,
    techStack: z.array(z.string().trim().min(1).max(100)).max(MAX_ITEMS).nullish().transform((v) => v ?? []),
    description: longText,
    githubLink: url,
    liveLink: url,
    startDate: date,
    endDate: date,
})

const skillSchema = z.object({
    name: text(100),
    category: text(100),
})

const achievementSchema = z.object({
    title: shortText,
    org: shortText,
    date: date,
    description: longText,
})

const porSchema = z.object({
    title: shortText,
    org: shortText,
    startDate: date,
    endDate: date,
    description: longText,
})

const publicationSchema = z.object({
    authors: text(1000),
    title: text(500),
    conference: shortText,
    place: shortText,
    publicationDate: date,
    description: longText,
})

export const resumeInputSchema = z.object({
    title: shortText,
    firstName: text(100),
    middleName: text(100),
    lastName: text(100),
    country: text(100),
    phoneNumber: text(30),
    resumeEmail: z.email().max(254).nullish().or(z.literal("").transform(() => null)),
    linkedIn: url,
    github: url,
    personalPortfolio: url,
    leetCode: url,
    codingProfile2: url,
    codingProfile3: url,
    summary: longText,
    dateOfBirth: text(50),
    address: text(500),
    // LLMs and forms often send "2026" as a string
    yearOfGraduation: z.preprocess(
        (v) => (v === "" || v == null ? null : Number(v)),
        z.number().int().min(1900).max(2100).nullable(),
    ).optional(),

    education: list(educationSchema),
    experience: list(experienceSchema),
    projects: list(projectSchema),
    // Skills are extracted one per row, so a single resume easily has 30+
    skills: list(skillSchema, 100),
    achievements: list(achievementSchema),
    pors: list(porSchema),
    publications: list(publicationSchema),
})

export type ResumeInput = z.infer<typeof resumeInputSchema>
