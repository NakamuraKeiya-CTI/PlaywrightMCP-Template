export type Role = '管理者' | '編集者' | '閲覧者'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export const initialUsers: User[] = [
  { id: '1', name: '山田太郎', email: 'yamada@example.com', role: '管理者' },
  { id: '2', name: '佐藤花子', email: 'sato@example.com', role: '編集者' },
  { id: '3', name: '鈴木一郎', email: 'suzuki@example.com', role: '閲覧者' },
]
