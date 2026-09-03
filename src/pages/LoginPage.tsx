import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { isLoggedIn, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoggedIn) {
    return <Navigate to="/users" replace />
  }

  const validate = () => {
    const next: { username?: string; password?: string } = {}
    if (!username.trim()) {
      next.username = 'ユーザー名を入力してください'
    } else if (username.trim().length < 3) {
      next.username = 'ユーザー名は3文字以上で入力してください'
    }
    if (!password) {
      next.password = 'パスワードを入力してください'
    } else if (password.length < 4) {
      next.password = 'パスワードは4文字以上で入力してください'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setTimeout(() => {
      login(username.trim())
      setIsSubmitting(false)
      navigate('/users')
    }, 600)
  }

  return (
    <section className="page login-page">
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="username">ユーザー名</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={Boolean(errors.username)}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </section>
  )
}
