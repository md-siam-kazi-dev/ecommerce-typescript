"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

const Accordion = AccordionPrimitive.Root

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-4 rounded-md py-5 text-left font-heading text-base font-medium tracking-[-0.01em] text-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:shrink-0",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-5 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[open]:grid-rows-[1fr]"
      {...props}
    >
      <div className="overflow-hidden">
        <div className={cn("pb-5 pr-8 text-sm leading-relaxed text-muted-foreground", className)}>
          {children}
        </div>
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
