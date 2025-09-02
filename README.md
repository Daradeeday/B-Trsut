B-Trust — ระบบการเงินโปร่งใสสำหรับสถานศึกษา

Blockchain-based Transparent Finance for Schools

TL;DR — B-Trust ใช้บล็อกเชนช่วยติดตามรายรับ-รายจ่ายและหลักฐานการเบิกจ่ายของสถานศึกษาแบบตรวจสอบได้ทุกขั้น พร้อมสิทธิ์การเข้าถึงตามบทบาทและลิงก์สาธารณะเพื่อความโปร่งใส

สารบัญ

ภาพรวมโครงการ

จุดเด่น

สถาปัตยกรรม

เทคโนโลยีที่ใช้

เริ่มต้นใช้งาน (Getting Started)

ไฟล์ตัวอย่าง .env

โครงสัญญาอัจฉริยะ (Smart Contracts)

โฟลว์การใช้งาน

โครงสร้างหน้าจอหลัก

สคีมาข้อมูลธุรกรรม

สคริปต์ที่มีให้

แนวทางความปลอดภัย

Roadmap

สำหรับรายงาน/ประกวด (NSC ฯลฯ)

License

ภาพรวมโครงการ

B-Trust คือระบบบริหารการเงินและการเบิกจ่ายที่ออกแบบมาเพื่อสถานศึกษา/หน่วยงานการศึกษา โดยบันทึก “ธุรกรรมสำคัญ” ลงบนบล็อกเชนเพื่อป้องกันการแก้ไขย้อนหลัง และแนบ หลักฐานอ้างอิง (เช่น ใบเสร็จ/สลิป) ผ่านการแฮช/เก็บ IPFS หรือที่เก็บภายนอก พร้อมแดชบอร์ดเพื่อสื่อสารข้อมูลกับผู้มีส่วนได้ส่วนเสียและสาธารณะ

ทำไมต้องบล็อกเชน?
เพื่อให้การตรวจสอบเป็นอิสระจากระบบภายใน ลดข้อครหาการแก้ไขย้อนหลัง และสร้างความเชื่อมั่นด้วย “หลักฐานบนเครือข่ายสาธารณะ” ที่ตรวจสอบได้

จุดเด่น

โปร่งใสและตรวจสอบได้: ธุรกรรมสำคัญถูกแฮชและบันทึกบนเชน (Sepolia / Polygon Amoy) พร้อมลิงก์ตรวจสอบ

สิทธิ์ตามบทบาท (RBAC): แยกบทบาท ADMIN, ACCOUNTING, AUDITOR, VIEWER คุมสิทธิ์อย่างชัดเจน

On-chain / Off-chain Toggle: เลือกบันทึกเต็ม/บันทึกแฮช + เก็บไฟล์บน IPFS/Storage ภายนอก

หลักฐานแนบธุรกรรม: แนบสลิป/เอกสารพร้อม sha256 และ URI

โหมดสาธารณะ: แชร์หน้า Public Proof/Feed ให้บุคคลทั่วไปดูได้โดยไม่ต้องล็อกอิน

เรียลไทม์อัปเดต: ใช้ viem/wagmi เฝ้าดูอีเวนต์สัญญาเพื่อรีเฟรชตารางทันที

รองรับหลายเชน (multichain): สลับเครือข่ายทดสอบ/จริงได้จากไฟล์คอนฟิก

สถาปัตยกรรม
[ผู้ใช้] ── Web App (Next.js 15, React 19, TS)
   │           ├─ UI (shadcn/ui, Tailwind, RainbowKit)
   │           ├─ State/Query (wagmi + viem)
   │           └─ API Routes (Next.js / Edge or Node runtime)
   │
   ├── Off-chain DB/Storage (เช่น Postgres/Supabase หรือ Firebase Storage)
   │           └─ เก็บเมทาดาต้า/ไฟล์แนบขนาดใหญ่
   │
   └── On-chain (Solidity 0.8.x @ Sepolia / Amoy)
               ├─ BTrustLedger.sol  (บันทึกธุรกรรม + RBAC)
               └─ Events/Proofs     (TxLogged, RoleGranted, ฯลฯ)

เทคโนโลยีที่ใช้

Frontend: Next.js 15 (App Router), React 19, TypeScript 5

Wallet/Chain: wagmi + viem, RainbowKit

UI: shadcn/ui, Tailwind CSS

Smart Contracts: Solidity 0.8.x, OpenZeppelin (AccessControl ฯลฯ)

Storage: IPFS (เช่น web3.storage/Pinata) หรือฐานข้อมูลภายนอก

Tools: pnpm, Foundry/Hardhat, ESLint, Prettier

เริ่มต้นใช้งาน (Getting Started)
1) ข้อกำหนดเบื้องต้น

Node.js ≥ 20

pnpm ≥ 9

Foundry หรือ Hardhat (เลือกอย่างใดอย่างหนึ่ง)

กระเป๋าเงินสำหรับทดสอบ (MetaMask) และ RPC ของเครือข่ายที่ใช้

2) ติดตั้งและรัน
# 1) ติดตั้ง dependency
pnpm install

# 2) คัดลอก .env ตัวอย่าง
cp .env.example .env.local   # สำหรับ Next.js ฝั่งเว็บ
cp packages/contracts/.env.example packages/contracts/.env  # ถ้ามีแพ็กเกจสัญญา

# 3) รันเว็บ
pnpm dev
# เปิด http://localhost:3000


หากใช้ Foundry สำหรับสัญญา:

cd packages/contracts
forge install
forge test -vvv
# ตั้ง RPC/Private key ใน .env แล้ว
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast


หรือใช้ Hardhat:

cd packages/contracts
pnpm hardhat test
pnpm hardhat run scripts/deploy.ts --network sepolia

ไฟล์ตัวอย่าง .env

ปรับชื่อ key ให้ตรงกับโปรเจกต์จริงของคุณ

# ===== Next.js (Frontend) =====
NEXT_PUBLIC_APP_NAME=B-Trust
NEXT_PUBLIC_CHAIN_ID=11155111                 # Sepolia (ตัวอย่าง)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/<YOUR_KEY>
NEXT_PUBLIC_WC_PROJECT_ID=<WalletConnect_Project_ID>
NEXT_PUBLIC_BTRUST_ADDRESS=0xYourDeployedLedgerAddress
NEXT_PUBLIC_ONCHAIN_ONLY=false                # true = บันทึกเต็มบนเชน / false = แฮช + off-chain
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_PUBLIC_FEED_ENABLED=true
NEXT_PUBLIC_IS_TESTNET=true

# ถ้าใช้ฐานข้อมูลภายนอก
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# ถ้าใช้อัปโหลดไฟล์
STORAGE_BUCKET_URL=<your-bucket-or-supabase-storage-url>
STORAGE_PUBLIC_READ=true

# จำกัดสิทธิ์ผู้ดูแลระบบ (เว็บแบ็กเอนด์จะตรวจซ้ำ)
ADMIN_EMAILS=admin@school.ac.th,finance@school.ac.th

# ===== Contracts (Foundry/Hardhat) =====
RPC_URL=https://sepolia.infura.io/v3/<YOUR_KEY>
PRIVATE_KEY=0xYourPrivateKey
ETHERSCAN_API_KEY=<optional_for_verify>

โครงสัญญาอัจฉริยะ (Smart Contracts)

BTrustLedger.sol (แนวคิด)

ใช้ AccessControl แยกสิทธิ์:

DEFAULT_ADMIN_ROLE — จัดการบทบาท

ACCOUNTING_ROLE — บันทึกธุรกรรม

AUDITOR_ROLE — ตรวจสอบ/อ่านข้อมูลพิเศษ

(ตัวอย่างเพิ่มเติม) TREASURER_ROLE — ยืนยันการจ่าย

โครงสร้างธุรกรรม (ตัวอย่าง):

struct Tx {
  bytes32 txId;          // hash อ้างอิงธุรกรรม
  address actor;         // ผู้ลงบันทึก
  uint256 amount;        // จำนวน (หน่วยย่อย)
  string  currency;      // "THB" / "USDC" / "NATIVE"
  string  category;      // "อุปกรณ์", "กิจกรรม", ฯลฯ
  string  metaURI;       // URI ไปยังไฟล์แนบหรือ JSON metadata
  uint64  timestamp;     // block timestamp
}


อีเวนต์หลัก: TransactionLogged(bytes32 txId, address actor, uint256 amount, string category, string metaURI)

ฟังก์ชันตัวอย่าง:

logTransaction(TxInput calldata in) — เฉพาะ ACCOUNTING_ROLE

grantRole(bytes32 role, address account) — เฉพาะ Admin

getTx(bytes32 txId) / verifyHash(...) — อ่าน/ตรวจพิสูจน์

หมายเหตุ: ขอบเขตจริงของสัญญาในโปรดักชันอาจมีการแยกสัญญา/อัปเกรด/เพิ่มระบบหยุดฉุกเฉิน (circuit breaker) ฯลฯ

โฟลว์การใช้งาน

Admin สร้างองค์กร/โปรเจกต์ ตั้งค่าเครือข่าย เป้าหมายโปร่งใส (เปิด Public Feed ได้)

Admin มอบบทบาทให้ผู้ใช้: บัญชี/เหรัญญิก/ผู้ตรวจสอบ

Accounting เพิ่มธุรกรรมแต่ละรายการ → แนบไฟล์ → ระบบคำนวณ sha256 → บันทึกบนเชน (หรือบันทึกแฮช) + เก็บ URI

Auditor เปิดแดชบอร์ดตรวจสอบ กดเข้า Proof เพื่อตรวจ hash/อีเวนต์บนเชน

Public เข้าชมหน้าสาธารณะ (เฉพาะข้อมูลที่องค์กรอนุญาตเผยแพร่)

โครงสร้างหน้าจอหลัก

Dashboard — ภาพรวมงบประมาณ/กราฟรายรับ-รายจ่าย/สถานะการตรวจ

Transactions (TxTable + TxDrawer) — ตารางธุรกรรม + แผงเพิ่ม/แก้ไข/ดูหลักฐาน

Roles / Members — จัดการบทบาทและคำเชิญ

Proof Viewer — ดูรายละเอียดธุรกรรม/ลิงก์ตรวจสอบบนเชน/ตรวจ hash

Public Feed — ฟีดธุรกรรมที่อนุญาตเผยแพร่ พร้อมลิงก์ยืนยัน

โค้ด UI ใช้ shadcn/ui + Tailwind โครงสร้างคงที่แต่ปรับแต่งธีมได้

สคีมาข้อมูลธุรกรรม

ตัวอย่าง JSON ที่ฝั่งเว็บใช้อัปโหลด/เก็บลงฐานข้อมูลภายนอก (กรณี Off-chain metadata):

{
  "txId": "0x6c0f...c2d1",
  "category": "อุปกรณ์การเรียน",
  "amount": 12500,
  "currency": "THB",
  "payee": "บริษัท เอ บี ซี",
  "note": "ซื้อแท็บเล็ต 5 เครื่อง",
  "attachments": [
    {
      "name": "receipt_2025-08-14.pdf",
      "sha256": "f2a1...9e7b",
      "uri": "ipfs://bafybeigd.../receipt.pdf"
    }
  ],
  "chain": {
    "network": "sepolia",
    "ledgerAddress": "0x....",
    "txHash": "0x...."
  },
  "createdAt": "2025-08-14T09:10:00Z",
  "createdBy": "user_abc"
}

สคริปต์ที่มีให้
pnpm dev             # รันเว็บโหมดพัฒนา
pnpm build           # สร้างโปรดักชัน
pnpm start           # รันโปรดักชัน (หากโฮสต์เอง)
pnpm lint            # ตรวจโค้ด
pnpm format:fix      # จัดรูปแบบโค้ด

# ถ้ามีแพ็กเกจสัญญา
pnpm -w test:contracts
pnpm -w deploy:sepolia
pnpm -w verify:sepolia

แนวทางความปลอดภัย

กุญแจส่วนตัว/คีย์ RPC เก็บใน .env และ CI Secret เท่านั้น ห้ามคอมมิต

สิทธิ์แยกบทบาท ให้แคบที่สุด และตรวจซ้ำที่ฝั่ง API ก่อนเขียนเชน

ไฟล์แนบ แฮชก่อนอัปโหลดเสมอ เก็บเฉพาะ URI สาธารณะตามนโยบายข้อมูล

เช็คที่มา (CORS/CSRF) สำหรับ API ส่วนที่เป็นแผงหลังบ้าน

ทดสอบสัญญา ครอบคลุม Flow ผิดปกติ (เช่น ผู้ไม่มีสิทธิ์ log, แก้ไขย้อนหลัง, ข้อมูลไม่ครบ)

Roadmap

 งบประมาณรายปี/โครงการ + การเบิกตามหมวด

 รองรับหลายโทเค็น/Stablecoin + อัตราแลกเปลี่ยนอ้างอิง

 Import CSV/Excel และตัวช่วยจับคู่ใบเสร็จ

 แจ้งเตือนความผิดปกติ (Anomaly rules)

 โมดูลรายงานสาธารณะพร้อม Embed/QR

 รองรับการเซ็นเอกสารอิเล็กทรอนิกส์ (เช่น e-Signature)
