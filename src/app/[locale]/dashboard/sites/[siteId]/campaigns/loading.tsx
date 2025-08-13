/**
 * @file loading.tsx
 * @description Esqueleto de carga de élite para la página de gestión de campañas.
 * @author Raz Podestá
 * @version 1.0.0
 */
import { ArrowLeft } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CampaignsPageSkeleton() {
  return (
    <div className="space-y-6 relative animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-muted rounded-md mb-2 flex items-center p-2">
            <ArrowLeft className="h-4 w-4 text-muted-foreground mr-2" />
            <div className="h-4 w-24 bg-muted-foreground/20 rounded-md" />
          </div>
          <div className="h-8 w-64 bg-muted rounded-md" />
          <div className="h-5 w-72 bg-muted rounded-md mt-2" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-md" />
      </div>

      <div className="h-10 w-1/3 bg-muted rounded-md" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <div className="h-5 w-24 bg-muted rounded-md" />
              </TableHead>
              <TableHead className="w-[15%]">
                <div className="h-5 w-16 bg-muted rounded-md" />
              </TableHead>
              <TableHead className="w-[30%]">
                <div className="h-5 w-32 bg-muted rounded-md" />
              </TableHead>
              <TableHead className="w-[15%]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-5 w-3/4 bg-muted rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-20 bg-muted rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-full bg-muted rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-muted rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
