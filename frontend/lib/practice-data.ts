// Mock data structure - designed to easily convert to database later
export interface PracticeDrill {
  id: number
  name: string
  description: string
  scoreType: "individual" | "final" // Whether tracking individual shots or final score
  targetShots: number // Number of shots in the drill
  createdAt: string
  updatedAt: string
}

export interface DrillSession {
  id: number
  drillId: number
  date: string
  scores: number[] // Individual shot scores (if scoreType is 'individual')
  finalScore?: number // Final score (if scoreType is 'final')
  notes?: string
  createdAt: string
}

// Mock data - will be replaced with database calls later
const mockDrills: PracticeDrill[] = [
  {
    id: 1,
    name: "50-Yard Wedge Accuracy",
    description: "Hit 10 wedge shots to a target 50 yards away. Score based on distance from pin.",
    scoreType: "individual",
    targetShots: 10,
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Putting Circle Drill",
    description: "Place 8 balls around the hole at 6 feet. Count how many you make.",
    scoreType: "final",
    targetShots: 8,
    createdAt: "2024-11-02T14:30:00Z",
    updatedAt: "2024-11-02T14:30:00Z",
  },
  {
    id: 3,
    name: "Driver Accuracy",
    description: "Hit 15 drives aiming for the fairway. Score based on accuracy.",
    scoreType: "individual",
    targetShots: 15,
    createdAt: "2024-11-03T09:15:00Z",
    updatedAt: "2024-11-03T09:15:00Z",
  },
]

const mockSessions: DrillSession[] = [
  // 50-Yard Wedge Accuracy sessions
  {
    id: 1,
    drillId: 1,
    date: "2024-12-01",
    scores: [8, 6, 9, 7, 5, 8, 9, 6, 7, 8],
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    id: 2,
    drillId: 1,
    date: "2024-12-03",
    scores: [7, 8, 8, 6, 9, 7, 8, 9, 6, 8],
    createdAt: "2024-12-03T10:00:00Z",
  },
  {
    id: 3,
    drillId: 1,
    date: "2024-12-05",
    scores: [9, 8, 9, 8, 7, 9, 8, 7, 9, 8],
    createdAt: "2024-12-05T10:00:00Z",
  },
  // Putting Circle Drill sessions
  // Driver Accuracy sessions
  {
    id: 7,
    drillId: 3,
    date: "2024-12-02",
    scores: [8, 7, 9, 6, 8, 7, 9, 8, 6, 7, 8, 9, 7, 8, 9],
    createdAt: "2024-12-02T09:00:00Z",
  },
  {
    id: 8,
    drillId: 3,
    date: "2024-12-04",
    scores: [9, 8, 8, 7, 9, 8, 9, 8, 7, 8, 9, 8, 8, 9, 8],
    createdAt: "2024-12-04T09:00:00Z",
  },
]

// Functions that will be replaced with database calls later
export function getPracticeDrills(): Promise<PracticeDrill[]> {
  return Promise.resolve([...mockDrills])
}

export function getPracticeDrill(id: number): Promise<PracticeDrill | null> {
  const drill = mockDrills.find((d) => d.id === id)
  return Promise.resolve(drill || null)
}

export function getDrillSessions(drillId: number): Promise<DrillSession[]> {
  const sessions = mockSessions.filter((s) => s.drillId === drillId)
  return Promise.resolve([...sessions])
}

export function addPracticeDrill(drill: Omit<PracticeDrill, "id" | "createdAt" | "updatedAt">): Promise<PracticeDrill> {
  const newDrill: PracticeDrill = {
    ...drill,
    id: Math.max(...mockDrills.map((d) => d.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockDrills.push(newDrill)
  return Promise.resolve(newDrill)
}

export function addDrillSession(session: Omit<DrillSession, "id" | "createdAt">): Promise<DrillSession> {
  const newSession: DrillSession = {
    ...session,
    id: Math.max(...mockSessions.map((s) => s.id)) + 1,
    createdAt: new Date().toISOString(),
  }
  mockSessions.push(newSession)
  return Promise.resolve(newSession)
}

export function deletePracticeDrill(id: number): Promise<boolean> {
  const index = mockDrills.findIndex((d) => d.id === id)
  if (index > -1) {
    mockDrills.splice(index, 1)
    // Also remove associated sessions
    const sessionIndices = mockSessions.map((s, i) => (s.drillId === id ? i : -1)).filter((i) => i > -1)
    sessionIndices.reverse().forEach((i) => mockSessions.splice(i, 1))
    return Promise.resolve(true)
  }
  return Promise.resolve(false)
}
