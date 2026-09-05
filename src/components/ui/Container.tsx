import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/** The page column: one max-width and one inline padding for the whole site. */
export function Container({ children, as: Tag = 'div', className }: ContainerProps) {
  return <Tag className={cn('container-site', className)}>{children}</Tag>;
}
