import React, { useState } from 'react';
import { UserProfile, Mode, AdventureType, Objective } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sword, BookOpen, GraduationCap, Trophy } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    objective: 'escola',
    level: 'iniciante',
    mode: 'simple',
    selectedSubject: 'Geral',
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = () => {
    if (step === 5) {
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-none shadow-2xl rounded-[24px] overflow-hidden text-white">
            <CardHeader className="bg-transparent border-b border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-all ${
                        i <= step ? 'bg-brand-primary' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Passo {step} de 5
                </span>
              </div>
              <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                {step === 1 && <><Sparkles className="text-brand-primary" /> Bem-vindo!</>}
                {step === 2 && <><BookOpen className="text-brand-secondary" /> Seu Objetivo</>}
                {step === 3 && <><Trophy className="text-brand-accent" /> Seu Nível</>}
                {step === 4 && <><Sword className="text-brand-secondary" /> Escolha seu Modo</>}
                {step === 5 && <><BookOpen className="text-brand-primary" /> Qual Matéria?</>}
              </CardTitle>
              <CardDescription className="text-white/60 font-medium">
                {step === 1 && "Vamos começar sua jornada de conhecimento."}
                {step === 2 && "O que você deseja aprender hoje?"}
                {step === 3 && "Como você avalia seu conhecimento atual?"}
                {step === 4 && "Como você prefere aprender?"}
                {step === 5 && "Escolha o foco dos seus estudos."}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[11px] uppercase tracking-wider font-bold text-white/50">Qual sua idade?</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Ex: 15"
                      className="glass-input h-12"
                      value={profile.age || ''}
                      onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) })}
                    />
                  </div>
                  <Button 
                    className="w-full btn-primary h-14 text-lg font-bold rounded-2xl mt-4"
                    disabled={!profile.age}
                    onClick={nextStep}
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={profile.objective}
                    onValueChange={(v: Objective) => setProfile({ ...profile, objective: v })}
                    className="grid grid-cols-1 gap-3"
                  >
                    {[
                      { id: 'alfabetização', label: 'Alfabetização', icon: Sparkles },
                      { id: 'escola', label: 'Reforço Escolar', icon: BookOpen },
                      { id: 'enem', label: 'Preparação ENEM', icon: GraduationCap },
                      { id: 'concurso', label: 'Concursos', icon: Trophy },
                    ].map(item => (
                      <Label
                        key={item.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border border-white/10 cursor-pointer transition-all ${
                          profile.objective === item.id 
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <RadioGroupItem value={item.id} className="sr-only" />
                        <item.icon size={20} />
                        <span className="font-bold text-lg">{item.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                  <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={prevStep} className="flex-1 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/10">Voltar</Button>
                    <Button className="flex-[2] btn-primary rounded-2xl font-bold h-12" onClick={nextStep}>Próximo</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {['Iniciante', 'Intermediário', 'Avançado'].map(lvl => (
                      <div
                        key={lvl}
                        onClick={() => setProfile({ ...profile, level: lvl })}
                        className={`glass-pill ${profile.level === lvl ? 'active' : ''}`}
                      >
                        {lvl}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-8">
                    <Button variant="ghost" onClick={prevStep} className="flex-1 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/10">Voltar</Button>
                    <Button className="flex-[2] btn-primary rounded-2xl font-bold h-12" onClick={nextStep}>Próximo</Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <button
                      onClick={() => setProfile({ ...profile, mode: 'simple', adventureType: undefined })}
                      className={`mode-card-glass w-full flex items-center gap-4 ${
                        profile.mode === 'simple' ? 'active' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                        <BookOpen size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">Modo Simples</h3>
                        <p className="text-xs text-white/50">Direto ao ponto, exercícios rápidos.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setProfile({ ...profile, mode: 'adventure', adventureType: 'light' })}
                      className={`mode-card-glass w-full flex items-center gap-4 ${
                        profile.mode === 'adventure' ? 'active' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                        <Sword size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">Modo Aventura</h3>
                        <p className="text-xs text-white/50">Narrativa, RPG e evolução.</p>
                      </div>
                    </button>
                  </div>

                  {profile.mode === 'adventure' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 pt-2"
                    >
                      <div
                        onClick={() => setProfile({ ...profile, adventureType: 'epic' })}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                          profile.adventureType === 'epic' 
                            ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' 
                            : 'border-white/10 bg-white/5 text-white/60'
                        }`}
                      >
                        RPG Épico
                      </div>
                      <div
                        onClick={() => setProfile({ ...profile, adventureType: 'light' })}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                          profile.adventureType === 'light' 
                            ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' 
                            : 'border-white/10 bg-white/5 text-white/60'
                        }`}
                      >
                        Aventura Leve
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button variant="ghost" onClick={prevStep} className="flex-1 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/10">Voltar</Button>
                    <Button className="flex-[2] btn-primary rounded-2xl font-bold h-14" onClick={nextStep}>Continuar</Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Inglês', 'Geral'].map(subj => (
                      <div
                        key={subj}
                        onClick={() => setProfile({ ...profile, selectedSubject: subj as any })}
                        className={`glass-pill ${profile.selectedSubject === subj ? 'active' : ''}`}
                      >
                        {subj}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-8">
                    <Button variant="ghost" onClick={prevStep} className="flex-1 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/10">Voltar</Button>
                    <Button className="flex-[2] btn-primary rounded-2xl font-bold h-14" onClick={handleComplete}>Iniciar Jornada</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
