import { NextResponse } from 'next/server'
import { getExpenses } from '@/src/services/expenseService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const expenses = await getExpenses(userId)
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// hoặc nếu bạn dùng POST:
export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ message: 'Success' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
