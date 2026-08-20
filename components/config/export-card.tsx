"use client";

import { useState } from "react";
import { FileText, Sheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MonthSelect } from "@/components/layout/month-select";
import { downloadText, entriesToCSV } from "@/lib/csv";
import { monthKey } from "@/lib/dates";
import { useStore } from "@/lib/store";

export function ExportCard() {
  const entries = useStore((s) => s.entries);
  const getCompany = useStore((s) => s.getCompany);
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [includeGastos, setIncludeGastos] = useState(false);

  const filtered = () => entries.filter((e) => e.data.startsWith(month)).sort((a, b) => a.data.localeCompare(b.data));

  function exportCSV() {
    const f = filtered();
    if (!f.length) {
      toast.error("Nenhum registro neste mês");
      return;
    }
    downloadText(`freela-${month}.csv`, "﻿" + entriesToCSV(f, getCompany), "text/csv");
  }

  function exportPDF() {
    window.open(`/relatorio?mes=${month}&gastos=${includeGastos ? 1 : 0}`, "_blank");
  }

  return (
    <Card className="py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">📤 Exportar relatório</div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="export-month" className="text-[11px] text-muted-foreground">Mês do relatório</Label>
          <MonthSelect id="export-month" value={month} onChange={setMonth} />
        </div>
        <Label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-normal">
          <Checkbox checked={includeGastos} onCheckedChange={(c) => setIncludeGastos(Boolean(c))} />
          Incluir alimentação e transporte no total
        </Label>
        <div className="flex gap-2">
          <Button className="flex-1 rounded-xl" onClick={exportPDF}>
            <FileText data-icon="inline-start" /> Exportar PDF
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl" onClick={exportCSV}>
            <Sheet data-icon="inline-start" /> CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
