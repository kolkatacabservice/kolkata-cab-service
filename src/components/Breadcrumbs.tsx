import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-gray-300" />
            {i === items.length - 1 ? (
              <span className="text-secondary font-medium">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
