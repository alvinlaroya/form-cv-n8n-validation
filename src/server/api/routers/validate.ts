import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    console.log("CALL FROM API", request)
}