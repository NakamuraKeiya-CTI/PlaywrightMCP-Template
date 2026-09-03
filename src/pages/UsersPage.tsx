import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UsersContext'
import type { Role } from '../data/mockUsers'

const ROLES: Role[] = ['管理者', '編集者', '閲覧者']

export function UsersPage() {
  const { username, logout } = useAuth()
  const { users, addUser, deleteUser } = useUsers()
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<Role>('閲覧者')
  const [addError, setAddError] = useState<string | null>(null)

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(keyword.trim().toLowerCase()),
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) {
      setAddError('氏名を入力してください')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setAddError('メールアドレスの形式が正しくありません')
      return
    }
    addUser({ name: newName.trim(), email: newEmail.trim(), role: newRole })
    setNewName('')
    setNewEmail('')
    setNewRole('閲覧者')
    setAddError(null)
    setIsAdding(false)
  }

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(`「${name}」を削除しますか？`)
    if (confirmed) {
      deleteUser(id)
    }
  }

  return (
    <section className="page users-page">
      <header className="page-header">
        <h1>ユーザー一覧</h1>
        <div className="header-actions">
          <span>ようこそ、{username} さん</span>
          <button type="button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          type="search"
          placeholder="名前で検索"
          aria-label="名前で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="button" onClick={() => setIsAdding((v) => !v)}>
          {isAdding ? 'キャンセル' : '新規追加'}
        </button>
      </div>

      {isAdding && (
        <form className="add-user-form" onSubmit={handleAddSubmit} noValidate>
          <input
            type="text"
            placeholder="氏名"
            aria-label="氏名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="email"
            placeholder="メールアドレス"
            aria-label="メールアドレス"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <select
            aria-label="役割"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as Role)}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button type="submit">追加</button>
          {addError && <p className="error-text">{addError}</p>}
        </form>
      )}

      {filteredUsers.length === 0 ? (
        <p className="empty-message">該当するユーザーがいません</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>氏名</th>
              <th>メールアドレス</th>
              <th>役割</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="row-actions">
                  <Link to={`/users/${user.id}`}>詳細</Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id, user.name)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
