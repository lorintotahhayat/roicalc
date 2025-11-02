"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

export default function ROICalculator() {
  const [months, setMonths] = useState(12);
  const [engineers, setEngineers] = useState(10);
  const [yearlyRate, setYearlyRate] = useState(150000);
  const [detRcaPercentNow, setDetRcaPercentNow] = useState(20);

  const calculations = useMemo(() => {
    const nowDecimal = detRcaPercentNow / 100;
    const projectTotalCost = (months / 12) * engineers * yearlyRate;
    const currentCost = projectTotalCost * nowDecimal;
    const savings = currentCost * 0.75;
    const reductionPercent = projectTotalCost > 0 ? (savings / projectTotalCost) * 100 : 0;

    return {
      projectTotalCost,
      currentCost,
      savings,
      reductionPercent
    };
  }, [months, engineers, yearlyRate, detRcaPercentNow]);

  const projectScenarios = [1, 5, 10, 20, 30];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return Math.round(value) + "%";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B3D] via-[#4A2545] to-[#6B2E4A]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,69,139,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,107,53,0.15),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-7xl">
        <div className="text-center mb-5">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Calculator className="w-9 h-9 text-[#FF6B35]" />
            Development Savings Calculator
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="border-b border-white/20 pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#FF6B35]" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div>
                <Label htmlFor="months" className="text-white mb-2 block text-sm">
                  Project Duration (Months)
                </Label>
                <Input
                  id="months"
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="engineers" className="text-white mb-2 block text-sm">Number of Engineers</Label>
                <Input
                  id="engineers"
                  type="number"
                  value={engineers}
                  onChange={(e) => setEngineers(Number(e.target.value))}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="yearlyRate" className="text-white mb-2 block text-sm">Engineering Yearly Rate ($)</Label>
                <Input
                  id="yearlyRate"
                  type="number"
                  value={yearlyRate}
                  onChange={(e) => setYearlyRate(Number(e.target.value))}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <Label htmlFor="detRcaNow" className="text-white mb-2 block text-sm">Detection + RCA % Now</Label>
                <Input
                  id="detRcaNow"
                  type="number"
                  value={detRcaPercentNow}
                  onChange={(e) => setDetRcaPercentNow(Number(e.target.value))}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="border-b border-white/20 pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
                Regression Cost & Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid gap-3">
                <div className="bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/5 p-3 rounded-lg border border-[#FF6B35]/30">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/70 text-xs">Cost</p>
                    <p className="text-white/50 text-[9px]">Total Project Cost</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-white text-xl font-bold">{formatCurrency(calculations.currentCost)}</p>
                    <p className="text-white/60 text-sm">/ {formatCurrency(calculations.projectTotalCost)}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C35] p-3 rounded-lg border border-[#FF6B35]">
                  <p className="text-white/90 text-xs mb-1">Savings</p>
                  <p className="text-white text-2xl font-bold">{formatCurrency(calculations.savings)}</p>
                </div>
                <div className="bg-gradient-to-br from-[#8B458B] to-[#6B2E6B] p-3 rounded-lg border border-[#8B458B]">
                  <p className="text-white/90 text-xs mb-1">Efficiency Gain</p>
                  <p className="text-white text-2xl font-bold">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-5 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="border-b border-white/20 pb-3">
            <CardTitle className="text-white text-lg">Multi-Project Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white/70 pb-3 pr-3 text-xs">Projects</th>
                    <th className="text-left text-white/70 pb-3 pr-3 text-xs">Months</th>
                    <th className="text-left text-white/70 pb-3 pr-3 text-xs">Engineers</th>
                    <th className="text-left text-white/70 pb-3 pr-3 text-xs">Yearly Rate</th>
                    <th className="text-left text-white/70 pb-3 pr-3 text-xs">RCA % Now</th>
                    <th className="text-left text-white/70 pb-3 text-xs">Total Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {projectScenarios.map((numProjects) => (
                    <tr key={numProjects} className="border-b border-white/10">
                      <td className="text-white font-semibold pt-3 pb-3 pr-3">{numProjects}</td>
                      <td className="text-white/80 pt-3 pb-3 pr-3">{months}</td>
                      <td className="text-white/80 pt-3 pb-3 pr-3">{engineers}</td>
                      <td className="text-white/80 pt-3 pb-3 pr-3">{formatCurrency(yearlyRate)}</td>
                      <td className="text-white/80 pt-3 pb-3 pr-3">{detRcaPercentNow}%</td>
                      <td className="text-[#FF6B35] font-bold pt-3 pb-3">{formatCurrency(calculations.savings * numProjects)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C35] p-5 rounded-lg shadow-2xl border border-[#FF6B35]">
          <p className="text-white text-center text-base md:text-lg font-medium leading-relaxed">
            By implementing LOCI, you save <span className="font-bold">{formatCurrency(calculations.savings)}</span> per project, 
            achieving a <span className="font-bold">{formatPercent(calculations.reductionPercent)}</span> reduction in total project cost across{" "}
            <span className="font-bold">{engineers} engineers</span> over <span className="font-bold">{months} months</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

