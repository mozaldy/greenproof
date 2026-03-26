import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

const payload = {
  userId: 'test-user-id',
  companyId: 'demo-company-001', // HARUS SAMA DENGAN HASIL SEED
  role: 'OPERATOR',
  suiAddress: '0x123...test'
}

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

console.log('--- TEST JWT GENERATED ---')
console.log(token)
console.log('---------------------------')
console.log('Usage example:')
console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3001/api/v1/tasks`)
