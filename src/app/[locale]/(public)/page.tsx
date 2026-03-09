import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, TrendingDown, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { LeadForm } from '@/components/forms/lead-form';

export default function HomePage() {
  const tHero = useTranslations('Hero');
  const tBenefits = useTranslations('Benefits');

  const benefits = [
    {
      icon: <TrendingDown className="h-8 w-8 text-primary" />,
      title: tBenefits('roiTitle'),
      desc: tBenefits('roiDesc'),
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: tBenefits('timeTitle'),
      desc: tBenefits('timeDesc'),
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: tBenefits('qualityTitle'),
      desc: tBenefits('qualityDesc'),
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: tBenefits('scaleTitle'),
      desc: tBenefits('scaleDesc'),
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* --- HERO SECTION --- */}
      <section className="w-full py-20 md:py-32 flex justify-center text-center px-4 relative overflow-hidden">
        {/* Фоновий градієнт для сучасного "AI" вигляду */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        <div className="max-w-4xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
            Next-Gen AI Solutions
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            {tHero('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            {tHero('subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
            <Button asChild size="lg" className="gap-2">
              <Link href="/agents">
                {tHero('ctaCatalog')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <LeadForm
              selectedItem='Custom AI Request (from Hero)'
              trigger={
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  {tHero('ctaContact')}
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="w-full py-20 bg-muted/50 flex justify-center px-4">
        <div className="max-w-6xl w-full flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {tBenefits('title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-md bg-background/60 backdrop-blur-sm transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}