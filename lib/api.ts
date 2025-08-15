// Mock API for B-Trust Financial Transparency System
// TODO: connect on-chain

export type Status = "PendingVotes" | "AwaitingManagement" | "Approved" | "Rejected" | "Expired"

export interface RequestItem {
  id: number
  description: string
  amountEth: string
  requester: string
  status: Status
  createdAt: string
  deadline: string
  yesCount: number
  noCount: number
  finalApprover?: string
  decidedAt?: string
}

export interface VotingConfig {
  approveThreshold: number
  rejectThreshold: number
  voteDeadlineDays: number
}

export interface RoleData {
  accounting: string[]
  management: string[]
}

// In-memory storage (will be synced with localStorage after mount)
let requests: RequestItem[] = [
  {
    id: 1,
    description: "ซื้ออุปกรณ์คอมพิวเตรสำหรับห้องเรียน",
    amountEth: "2.5",
    requester: "0x1234...5678",
    status: "PendingVotes",
    createdAt: "2024-01-15T10:00:00Z",
    deadline: "2024-01-22T10:00:00Z",
    yesCount: 2,
    noCount: 1,
  },
  {
    id: 2,
    description: "จ้างบริการทำความสะอาดอาคาร",
    amountEth: "1.8",
    requester: "0x9876...4321",
    status: "Approved",
    createdAt: "2024-01-10T14:30:00Z",
    deadline: "2024-01-17T14:30:00Z",
    yesCount: 4,
    noCount: 0,
    finalApprover: "0xabcd...efgh",
    decidedAt: "2024-01-16T09:15:00Z",
  },
]

let votingConfig: VotingConfig = {
  approveThreshold: 3,
  rejectThreshold: 2,
  voteDeadlineDays: 7,
}

let roles: RoleData = {
  accounting: ["0x1111...aaaa", "0x2222...bbbb", "0x3333...cccc"],
  management: ["0xaaaa...1111", "0xbbbb...2222"],
}

// Utility functions
const saveToStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("btrust-requests", JSON.stringify(requests))
    localStorage.setItem("btrust-config", JSON.stringify(votingConfig))
    localStorage.setItem("btrust-roles", JSON.stringify(roles))
  }
}

const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedRequests = localStorage.getItem("btrust-requests")
    const savedConfig = localStorage.getItem("btrust-config")
    const savedRoles = localStorage.getItem("btrust-roles")

    if (savedRequests) requests = JSON.parse(savedRequests)
    if (savedConfig) votingConfig = JSON.parse(savedConfig)
    if (savedRoles) roles = JSON.parse(savedRoles)
  }
}

// Initialize storage on first load
if (typeof window !== "undefined") {
  loadFromStorage()
}

// API Functions
export async function listRequests(filter?: Partial<Pick<RequestItem, "status">>): Promise<RequestItem[]> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate network delay

  let filtered = [...requests]
  if (filter?.status) {
    filtered = filtered.filter((req) => req.status === filter.status)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getRequest(id: number): Promise<RequestItem | undefined> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 50))
  return requests.find((req) => req.id === id)
}

export async function createRequest({
  description,
  amountEth,
  requester,
}: {
  description: string
  amountEth: string
  requester: string
}): Promise<RequestItem> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newRequest: RequestItem = {
    id: Math.max(...requests.map((r) => r.id), 0) + 1,
    description,
    amountEth,
    requester,
    status: "PendingVotes",
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + votingConfig.voteDeadlineDays * 24 * 60 * 60 * 1000).toISOString(),
    yesCount: 0,
    noCount: 0,
  }

  requests.push(newRequest)
  saveToStorage()
  return newRequest
}

export async function castVote(id: number, voter: string, support: boolean): Promise<RequestItem> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 150))

  const request = requests.find((req) => req.id === id)
  if (!request) throw new Error("Request not found")

  if (request.status !== "PendingVotes") {
    throw new Error("Voting is not available for this request")
  }

  // Update vote counts
  if (support) {
    request.yesCount++
  } else {
    request.noCount++
  }

  // Check for early resolution
  if (request.yesCount >= votingConfig.approveThreshold) {
    request.status = "AwaitingManagement"
  } else if (request.noCount >= votingConfig.rejectThreshold) {
    request.status = "Rejected"
    request.decidedAt = new Date().toISOString()
  }

  saveToStorage()
  return request
}

export async function finalize(id: number, manager: string, approve: boolean): Promise<RequestItem> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 200))

  const request = requests.find((req) => req.id === id)
  if (!request) throw new Error("Request not found")

  if (request.status !== "AwaitingManagement") {
    throw new Error("Request is not awaiting management approval")
  }

  request.status = approve ? "Approved" : "Rejected"
  request.finalApprover = manager
  request.decidedAt = new Date().toISOString()

  saveToStorage()
  return request
}

export async function listRoles(): Promise<RoleData> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 50))
  return { ...roles }
}

export async function grantRole(role: "accounting" | "management", address: string): Promise<void> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!roles[role].includes(address)) {
    roles[role].push(address)
    saveToStorage()
  }
}

export async function revokeRole(role: "accounting" | "management", address: string): Promise<void> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 100))

  roles[role] = roles[role].filter((addr) => addr !== address)
  saveToStorage()
}

export async function getVotingConfig(): Promise<VotingConfig> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 50))
  return { ...votingConfig }
}

export async function setVotingConfig(config: VotingConfig): Promise<void> {
  // TODO: connect on-chain
  await new Promise((resolve) => setTimeout(resolve, 100))

  votingConfig = { ...config }
  saveToStorage()
}
