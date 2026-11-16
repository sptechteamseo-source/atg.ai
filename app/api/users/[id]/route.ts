import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { parseUserUpdate } from '@/lib/user-validation'
import bcrypt from 'bcryptjs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('manage:users')
    const { id } = await params

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        createdat: true,
        _count: { select: { blogs: true, usecases: true } },
      },
    })

    if (!user) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: user })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:users')
    const { id } = await params

    const result = parseUserUpdate(await request.json())
    if ('error' in result) {
      return Response.json({ success: false, error: result.error }, { status: 400 })
    }
    const data = result.data

    // Reject an update that would change nothing (all fields blank/untouched).
    if (Object.keys(data).length === 0) {
      return Response.json({ success: false, error: 'No changes to save' }, { status: 400 })
    }

    // The target user must exist.
    const target = await prisma.users.findUnique({ where: { id }, select: { id: true } })
    if (!target) {
      return Response.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Prevent admins from locking themselves out by demoting or
    // deactivating their own account.
    if (id === session.user.id) {
      if (data.role && data.role !== 'admin') {
        return Response.json({ success: false, error: 'You cannot change your own role' }, { status: 400 })
      }
      if (data.status === 'inactive') {
        return Response.json({ success: false, error: 'You cannot deactivate your own account' }, { status: 400 })
      }
    }

    // Guard email uniqueness when changing it
    if (data.email) {
      const existing = await prisma.users.findUnique({ where: { email: data.email } })
      if (existing && existing.id !== id) {
        return Response.json({ success: false, error: 'Email already in use' }, { status: 409 })
      }
    }

    const { password, ...rest } = data

    // Hash password if it's being changed
    const updateData: any = { ...rest }
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.users.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        createdat: true,
      },
    })

    return Response.json({ success: true, data: user })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:users')
    const { id } = await params

    // Prevent deleting yourself
    if (session.user.id === id) {
      return Response.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Guard: MongoDB has no FK constraints — check manually before deleting
    const [blogCount, usecaseCount] = await Promise.all([
      prisma.blog.count({ where: { authorid: id } }),
      prisma.usecase.count({ where: { authorid: id } }),
    ])
    if (blogCount > 0 || usecaseCount > 0) {
      return Response.json(
        {
          success: false,
          error: 'Cannot delete — this user still owns blogs or use cases. Reassign their content first.',
        },
        { status: 409 }
      )
    }

    await prisma.users.delete({ where: { id } })

    return Response.json({ success: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('[DELETE /api/users/:id]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to delete user' }, { status: 500 })
  }
}
