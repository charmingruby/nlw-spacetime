import { getUser } from '@/lib/auth'
import Image from 'next/image'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-full"
      />
      <p className="max-w-[150px] text-sm leading-snug">
        {name}
        <a
          className="block text-red-400 hover:text-red-300"
          href="/api/auth/logout"
        >
          Finalizar sessão
        </a>
      </p>
    </div>
  )
}
