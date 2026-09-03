import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUsers } from '../context/UsersContext'
import type { Role } from '../data/mockUsers'

const ROLES: Role[] = ['管理者', '編集者', '閲覧者']

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getUser, updateUser, deleteUser } = useUsers()

  const user = getUser(id ?? '')

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<Role>(user?.role ?? '閲覧者')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    const current = getUser(id ?? '')
    if (current) {
      setName(current.name)
      setEmail(current.email)
      setRole(current.role)
      setSavedMessage(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!user) {
    return (
      <section className="page">
        <h1>ユーザーが見つかりません</h1>
        <p>指定されたユーザーは存在しないか、削除された可能性があります。</p>
        <Link to="/users">一覧へ戻る</Link>
      </section>
    )
  }

  const validate = () => {
    const next: { name?: string; email?: string } = {}
    if (!name.trim()) {
      next.name = '氏名を入力してください'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'メールアドレスの形式が正しくありません'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    setSavedMessage(false)
    setTimeout(() => {
      updateUser(user.id, { name: name.trim(), email: email.trim(), role })
      setIsSaving(false)
      setSavedMessage(true)
    }, 500)
  }

  const handleDelete = () => {
    const confirmed = window.confirm(`「${user.name}」を削除しますか？`)
    if (confirmed) {
      deleteUser(user.id)
      navigate('/users')
    }
  }

  return (
    <section className="page user-detail-page">
      <h1>ユーザー詳細</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">氏名</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="role">役割</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={handleDelete}>
            削除
          </button>
          <Link to="/users">一覧へ戻る</Link>
        </div>

        {savedMessage && <p className="success-text">保存しました</p>}
      </form>
    </section>
  )
}
