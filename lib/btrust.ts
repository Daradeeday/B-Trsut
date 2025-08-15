"use client"

import RAW from "@/lib/abi/BTrust.json"
import type { Abi, Address } from "viem"
import { parseEther, keccak256, stringToBytes , decodeErrorResult } from "viem"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"


// ---------- ABI & Contract ----------
export const abi: Abi = (((RAW as any).abi ?? RAW) as Abi)
export const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address
export const ONCHAIN = !!CONTRACT

// ---------- Helper: รายชื่อฟังก์ชันใน ABI (กันพิมพ์ผิด) ----------
function abiFunctionNames(a: Abi): Set<string> {
  return new Set((a as any[]).filter(x => x?.type === "function").map(x => String(x.name)))
}
const ABI_FUNCS = abiFunctionNames(abi)

// ---------- Hook หลัก ----------
export function useBTrust() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  if (!ONCHAIN) console.warn("⚠ NEXT_PUBLIC_CONTRACT_ADDRESS not set")

  async function ensureReady() {
    if (!publicClient) throw new Error("Public client not ready")
    if (!address) throw new Error("Wallet not connected")
    if (!CONTRACT) throw new Error("Contract address not configured")
  }

  // ---------- Utils ----------
  function filterCandidates<T extends { name: string }>(cands: T[]): T[] {
    const ok = cands.filter(c => ABI_FUNCS.has(c.name))
    if (ok.length === 0) {
      const wanted = cands.map(c => c.name).join(", ")
      const available = [...ABI_FUNCS].sort().join(", ")
      throw new Error(`No matching function in ABI. wanted=[${wanted}] available=[${available}]`)
    }
    return ok
  }

  async function readAny<T = unknown>(candidates: { name: string; args?: any[] }[]): Promise<T> {
    await ensureReady()
    let lastErr: any
    for (const c of filterCandidates(candidates)) {
      try {
        return (await publicClient!.readContract({
          address: CONTRACT,
          abi,
          functionName: c.name as any,
          args: (c.args ?? []) as any,
        })) as T
      } catch (e) {
        lastErr = e
      }
    }
    throw lastErr
  }
function prettyHex(x: unknown) {
  if (typeof x === "string" && x.startsWith("0x") && x.length > 14) {
    return `${x.slice(0, 10)}…${x.slice(-6)}`
  }
  return x as any
}

function extractViemRevert(e: any) {
  const short = e?.shortMessage || e?.message
  const details = e?.details
  const cause = e?.cause
  const causeMsg = cause?.shortMessage || cause?.message

  // viem บางเวอร์ชันใส่ custom error ตรงนี้
  const errName = cause?.data?.errorName
  const errArgs = cause?.data?.args

  // low-level revert data (ถ้ามี)
  const dataHex =
    (typeof cause?.data?.data === "string" && cause.data.data) ||
    (typeof cause?.data === "string" && cause.data) ||
    undefined

  let decoded: any = null
  try {
    if (typeof dataHex === "string" && dataHex.startsWith("0x")) {
      decoded = decodeErrorResult({ abi, data: dataHex as `0x${string}` })
      // จะได้ { errorName, args } ถ้าเป็น custom error ที่อยู่ใน ABI
    }
  } catch {
    // เผื่อ decode ไม่สำเร็จ ก็ปล่อยว่าง
  }

  return { short, details, causeMsg, errName, errArgs, dataHex, decoded }
}

  async function writeAny(
  candidates: { name: string; args?: any[]; value?: bigint }[]
): Promise<`0x${string}`> {
  await ensureReady()
  let lastErr: any
  for (const c of filterCandidates(candidates)) {
    try {
      const sim = await publicClient!.simulateContract({
        account: address!,
        address: CONTRACT,
        abi,
        functionName: c.name as any,
        args: (c.args ?? []) as any,
        value: c.value,
      })
      return await writeContractAsync(sim.request)
    } catch (e: any) {
      const info = extractViemRevert(e)
      console.error(`[writeAny] revert on "${c.name}"`, {
        args: c.args,
        value: c.value?.toString(),
        short: info.short,
        causeMsg: info.causeMsg,
        errorName: info.errName || info.decoded?.errorName,
        errorArgs: info.errArgs || info.decoded?.args,
        dataHex: prettyHex(info.dataHex),
        details: info.details,
      })
      lastErr = e
    }
  }
  throw lastErr
}



  // ---------- Diagnose (ตัวช่วยเช็คสาเหตุก่อนยิงจริง) ----------
  async function roleBytes32(name: string): Promise<`0x${string}`> {
    try {
      return await publicClient!.readContract({ address: CONTRACT, abi, functionName: name as any }) as `0x${string}`
    } catch {
      return keccak256(stringToBytes(name)) as `0x${string}` // fallback ถ้าไม่มี getter
    }
  }

  async function diagnoseCreateRequest(sender: Address, title: string, amountEth: string) {
  await ensureReady()
  const reasons: string[] = []

  // paused?
  try {
    const paused = await publicClient!.readContract({ address: CONTRACT, abi, functionName: "paused" as any })
    if (paused) reasons.push("สัญญาอยู่สถานะ paused")
  } catch {}

  // role?
  try {
    const roleBytes32 = async (name: string): Promise<`0x${string}`> => {
  try {
    return await publicClient!.readContract({ address: CONTRACT, abi, functionName: name as any }) as `0x${string}`
  } catch {
    return keccak256(stringToBytes(name)) as `0x${string}`
  }
}

    const ACCOUNTING = await roleBytes32("ACCOUNTING_ROLE")
    const has = (await publicClient!.readContract({
  address: CONTRACT,
  abi,
  functionName: "hasRole" as any,
  args: [ACCOUNTING, sender],
})) as boolean

if (!has) reasons.push(`ผู้ส่งยังไม่มี ACCOUNTING_ROLE`)

  } catch {}

  // config?
  try {
    const approve = await publicClient!.readContract({ address: CONTRACT, abi, functionName: "approveThreshold" as any })
    const reject  = await publicClient!.readContract({ address: CONTRACT, abi, functionName: "rejectThreshold" as any })
    const days    = await publicClient!.readContract({ address: CONTRACT, abi, functionName: "voteDeadlineDays" as any })
    if (Number(approve) <= 0 || Number(reject) <= 0 || Number(days) <= 0) {
      reasons.push("ค่า config โหวต (approve/reject/deadline) ยังไม่ถูกตั้ง (>0)")
    }
  } catch {}

  // input
  if (!title?.trim()) reasons.push("รายละเอียดคำขอว่าง")
  let wei = 0n
  try {
    wei = parseEther(amountEth)
    if (wei <= 0n) reasons.push("จำนวนเงินต้อง > 0")
  } catch {
    reasons.push("จำนวนเงินไม่ใช่รูปแบบ ETH ที่ถูกต้อง")
  }

  // simulate ตรงๆ พร้อม value
  try {
    await publicClient!.simulateContract({
      account: sender,
      address: CONTRACT,
      abi,
      functionName: "createRequest",
      args: [title, wei],
      value: wei,
    })
  } catch (e: any) {
    const name = e?.cause?.data?.errorName
    const msg  = e?.shortMessage || e?.details || e?.message
    reasons.push(name ? `simulate reverted: ${name}` : `simulate reverted: ${msg}`)
  }

  return reasons
}


  // ---------- ฟังก์ชันใช้งานจริง ----------
  /** สร้างคำขอเบิกเงิน */
  async function createRequest(description: string, amountEth: string) {
  const valueWei = parseEther(amountEth)
  const f = (abi as any[]).find((x) => x?.type === "function" && x.name === "createRequest")
  const isPayable = f?.stateMutability === "payable"

  if (isPayable) {
    return writeAny([{ name: "createRequest", args: [description, valueWei], value: valueWei }])
  } else {
    return writeAny([{ name: "createRequest", args: [description, valueWei] }])
  }
}


  async function castVote(requestId: number, support: boolean) {
    return writeAny([{ name: "castVote", args: [BigInt(requestId), support] }])
  }

  async function withdrawRequest(requestId: number) {
    return writeAny([{ name: "withdrawRequest", args: [BigInt(requestId)] }])
  }

  async function getRequest(requestId: number) {
    return readAny([{ name: "getRequest", args: [BigInt(requestId)] }])
  }

  async function getVotingConfig() {
    return readAny([{ name: "getVotingConfig" }])
  }

  // ==== READ HELPERS (safe; จะข้ามเองถ้าไม่มีใน ABI) ====
async function getPaused(): Promise<boolean | undefined> {
  try { return await readAny<boolean>([{ name: "paused" }]) } catch { return undefined }
}
async function getAccountingRoleHash(): Promise<`0x${string}` | undefined> {
  try { return await readAny<`0x${string}`>([{ name: "ACCOUNTING_ROLE" }]) } catch { return undefined }
}
async function hasAccountingRole(addr: Address): Promise<boolean | undefined> {
  try {
    const role = await getAccountingRoleHash()
    if (!role) return undefined
    return await readAny<boolean>([{ name: "hasRole", args: [role, addr] }])
  } catch { return undefined }
}
async function getVotingConfigRaw(): Promise<{approve?: bigint; reject?: bigint; days?: bigint}> {
  const out: any = {}
  try { out.approve = await readAny<bigint>([{ name: "approveThreshold" }]) } catch {}
  try { out.reject  = await readAny<bigint>([{ name: "rejectThreshold" }]) } catch {}
  try { out.days    = await readAny<bigint>([{ name: "voteDeadlineDays" }]) } catch {}
  return out
}
async function getMinRequestWei(): Promise<bigint | undefined> {
  try { return await readAny<bigint>([{ name: "minRequestWei" }]) } catch { return undefined }
}

// ==== ADMIN ACTIONS (จะสำเร็จก็ต่อเมื่อฟังก์ชันมีใน ABI และผู้เรียกมีสิทธิ์) ====
async function unpauseIfPossible() {
  return writeAny([{ name: "unpause" }])
}
async function setVotingConfig(approve: bigint, reject: bigint, days: bigint) {
  return writeAny([{ name: "setVotingConfig", args: [approve, reject, days] }])
}
async function grantAccountingRole(target: Address) {
  const role = await getAccountingRoleHash()
  if (!role) throw new Error("ACCOUNTING_ROLE getter not found in ABI")
  return writeAny([{ name: "grantRole", args: [role, target] }])
}

// ==== ONE-SHOT PROBE (สรุปภาพรวมให้หน้า UI ใช้) ====
async function probeCreateRequestPrereqs(sender: Address) {
  await ensureReady()
  const [paused, hasAcc, cfg, minWei] = await Promise.all([
    getPaused(),
    hasAccountingRole(sender),
    getVotingConfigRaw(),
    getMinRequestWei(),
  ])
  return {
    paused,
    hasAccountingRole: hasAcc,
    approveThreshold: cfg.approve,
    rejectThreshold:  cfg.reject,
    voteDeadlineDays: cfg.days,
    minRequestWei:    minWei,
    isPayable: (() => {
      const f = (abi as any[]).find((x) => x?.type === "function" && x.name === "createRequest")
      return f?.stateMutability === "payable"
    })(),
  }
}


  return {
  createRequest,
  castVote,
  withdrawRequest,
  getRequest,
  getVotingConfig,
  diagnoseCreateRequest,
  // ▼ ใหม่
  probeCreateRequestPrereqs,
  grantAccountingRole,
  setVotingConfig,
  unpauseIfPossible,
}

}
