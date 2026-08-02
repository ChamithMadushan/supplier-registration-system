import React from 'react'

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'p-6',
  as: Tag = 'div',
}) {
  const interactive = hover || onClick
  return (
    <Tag
      onClick={onClick}
      className={`bg-card rounded-[12px] border border-line-soft shadow-[var(--shadow-card)] ${padding} ${interactive ? 'transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
