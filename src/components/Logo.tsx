import Image from 'next/image'

import { BUSINESS_SHORT } from '@/lib/site'

export function Logo({
  className,
  priority,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/images/305doors/logo.png"
      alt={`${BUSINESS_SHORT} — garage door installation and repair Miami`}
      width={512}
      height={225}
      className={className}
      priority={priority}
    />
  )
}
