import React from 'react'
import { cn } from '../../../lib/utils'

const DropdownMenuContext = React.createContext()

export function DropdownMenu({ children, open, onOpenChange }) {
  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export const DropdownMenuTrigger = React.forwardRef(({ asChild = false, children, ...props }, ref) => {
  return React.cloneElement(children, {
    ref,
    ...props,
  })
})

export const DropdownMenuContent = React.forwardRef(({ className, align = 'start', children, ...props }, ref) => {
  const { open } = React.useContext(DropdownMenuContext)

  if (!open) return null

  const alignment = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full mt-1 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50",
        alignment[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

export const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
