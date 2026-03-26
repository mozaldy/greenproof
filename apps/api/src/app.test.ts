import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from './app'

describe('API Integration Tests', () => {
  it('GET /health should return 200 and status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      status: 'ok',
      ts: expect.any(String)
    })
  })
})
