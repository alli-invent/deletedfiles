import React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../lib/utils'
import { ChevronDown } from 'lucide-react'

const SelectContext = React.createContext()

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = React.useState(false)

  const contextValue = React.useMemo(() => ({
    value,
    onValueChange,
    open,
    setOpen
  }), [value, onValueChange, open])

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { value, open, setOpen } = React.useContext(SelectContext)

  return (
    <button
      ref={ref}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children || <span>{value}</span>}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})

export const SelectValue = React.forwardRef(({ placeholder }, ref) => {
  const { value } = React.useContext(SelectContext)

  return (
    <span ref={ref} className="truncate">
      {value || placeholder}
    </span>
  )
})

export const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext)
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 })

  const triggerRef = React.useRef()

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        width: position.width
      }}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>,
    document.body
  )
})

export const SelectItem = React.forwardRef(({ value, className, children, ...props }, ref) => {
  const { onValueChange, setOpen } = React.useContext(SelectContext)

  const handleClick = () => {
    onValueChange(value)
    setOpen(false)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
