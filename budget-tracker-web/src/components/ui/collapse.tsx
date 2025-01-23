import React, { JSX, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./shadcn/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "./shadcn/button";

// TODO: P3 Chevron animation in select
export const Collapse = ({ title, children, className, id }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(className)}
    >
      <CollapsibleTrigger
        id={id}
        asChild
        className="flex gap-2 items-center w-full rounded py-2"
      >
        <Button variant="outline" className="justify-between font-normal">
          {title}
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform hover:bg-accent opacity-50",
              isOpen && "transform rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

type CollapseProps = {
  title: string;
  children: JSX.Element;
  className?: string;
  id?: string;
};
