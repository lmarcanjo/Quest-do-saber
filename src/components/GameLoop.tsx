import React, { useState, useEffect } from 'react';
import { UserProfile, GameState, Challenge } from '../types';
import { generateChallenge, generateStoryIntro } from '../services/geminiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trophy, Zap, ChevronRight, AlertCircle, CheckCircle2, Loader2, Sword, Shield, Map } from 'lucide-react';

interface GameLoopProps {
  profile: UserProfile;
  initialGameState?: GameState;
}

export default function GameLoop({ profile, initialGameState }: GameLoopProps) {
  const [gameState, setGameState] = useState<GameState>(initialGameState || {
    xp: 0,
    level: 1,
    lives: 5,
    history: [],
  });
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [storyIntro, setStoryIntro] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(profile.mode === 'adventure');

  useEffect(() => {
    async function init() {
      if (profile.mode === 'adventure') {
        const intro = await generateStoryIntro(profile);
        setStoryIntro(intro);
      }
      loadNextChallenge();
    }
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('eduquest_gamestate', JSON.stringify(gameState));
  }, [gameState]);

  const loadNextChallenge = async () => {
    setLoading(true);
    setSelectedOption(null);
    setFeedback(null);
    try {
      const challenge = await generateChallenge(profile, gameState);
      setCurrentChallenge(challenge);
    } catch (error) {
      console.error("Failed to load challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;
    setSelectedOption(option);
    const isCorrect = option === currentChallenge?.correctAnswer;
    
    if (isCorrect) {
      setFeedback({
        correct: true,
        message: currentChallenge?.explanation || "Excelente trabalho!",
      });
      setGameState(prev => {
        const newXp = prev.xp + (currentChallenge?.reward.xp || 15);
        const newLevel = Math.floor(newXp / 100) + 1;
        const newHistory = [...prev.history, currentChallenge?.question || ''].slice(-10);
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          history: newHistory,
          currentMission: currentChallenge?.context
        };
      });
    } else {
      setFeedback({
        correct: false,
        message: `Ops! A resposta correta era: ${currentChallenge?.correctAnswer}. ${currentChallenge?.explanation}`,
      });
      setGameState(prev => ({
        ...prev,
        lives: Math.max(0, prev.lives - 1),
        history: [...prev.history, currentChallenge?.question || ''].slice(-10)
      }));
    }
  };

  if (showIntro && storyIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="max-w-2xl text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-brand-secondary rounded-full flex items-center justify-center animate-pulse">
              <Sword size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Sua Jornada Começa...</h1>
          <p className="text-xl leading-relaxed text-slate-300 italic">"{storyIntro}"</p>
          <Button 
            onClick={() => setShowIntro(false)}
            className="btn-secondary h-14 px-10 text-xl font-bold rounded-2xl"
          >
            Entrar na Aventura <ChevronRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Stats */}
      <div className="sticky top-0 z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-brand-primary shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.objective}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white">Nível {gameState.level}</span>
                <Badge variant="secondary" className="bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30">
                  {profile.selectedSubject || 'Geral'}
                </Badge>
                <Badge variant="outline" className="text-[10px] border-white/20 text-white/50">
                  {profile.mode === 'adventure' ? 'Aventura' : 'Simples'}
                </Badge>
              </div>
              <div className="w-32 mt-1">
                <Progress value={gameState.xp % 100} className="h-1.5 bg-white/10" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-brand-error font-black drop-shadow-[0_0_8px_rgba(255,75,75,0.4)]">
              <Heart className="fill-current" size={20} />
              <span>{gameState.lives}</span>
            </div>
            <div className="flex items-center gap-1 text-brand-accent font-black drop-shadow-[0_0_8px_rgba(255,200,0,0.4)]">
              <Zap className="fill-current" size={20} />
              <span>{gameState.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-4 mt-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <Loader2 className="animate-spin text-brand-secondary" size={48} />
              <p className="text-slate-500 font-bold animate-pulse">Preparando seu próximo desafio...</p>
            </motion.div>
          ) : currentChallenge ? (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {currentChallenge.context.includes('[Modo Offline]') && (
                <div className="bg-amber-500/20 border border-amber-500/30 text-amber-200 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider w-fit">
                  Modo de Segurança (IA em Repouso)
                </div>
              )}

              {profile.mode === 'adventure' && (
                <div className="glass-card p-4 flex gap-4 items-start border-brand-primary/20">
                  <div className="bg-brand-primary/20 p-2 rounded-lg text-brand-primary">
                    <Map size={20} />
                  </div>
                  <p className="text-white/80 font-medium italic">"{currentChallenge.context}"</p>
                </div>
              )}

              <h2 className="text-2xl font-black text-white leading-tight drop-shadow-sm">
                {currentChallenge.question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={!!feedback}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 text-left rounded-2xl border transition-all font-bold text-lg ${
                      selectedOption === option
                        ? feedback?.correct
                          ? 'border-brand-primary bg-brand-primary/20 text-brand-primary'
                          : 'border-brand-error bg-brand-error/20 text-brand-error'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                    } ${feedback && option === currentChallenge.correctAnswer ? 'border-brand-primary bg-brand-primary/20 text-brand-primary' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedOption === option && (
                        feedback?.correct ? <CheckCircle2 className="text-brand-primary" /> : <AlertCircle className="text-brand-error" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-2xl border backdrop-blur-xl ${
                    feedback.correct ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-brand-error/10 border-brand-error/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${feedback.correct ? 'bg-brand-primary' : 'bg-brand-error'} text-white shadow-lg`}>
                      {feedback.correct ? <Trophy size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`font-black text-xl ${feedback.correct ? 'text-brand-primary' : 'text-brand-error'}`}>
                        {feedback.correct ? 'Muito bem!' : 'Quase lá!'}
                      </h3>
                      <p className="text-white/80 font-medium">{feedback.message}</p>
                      {feedback.correct && currentChallenge.reward.item && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-brand-accent text-slate-900 border-none font-bold">
                            Item Ganho: {currentChallenge.reward.item}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={loadNextChallenge}
                    className={`w-full mt-6 h-14 text-lg font-bold rounded-2xl ${
                      feedback.correct ? 'btn-primary' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {feedback.correct ? 'Continuar' : 'Tentar Próximo'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <AlertCircle size={48} className="mx-auto text-brand-error opacity-50" />
              <p className="text-white/60 font-medium">Não conseguimos carregar o desafio.</p>
              <Button onClick={loadNextChallenge} className="btn-primary px-8">
                Tentar Novamente
              </Button>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Game Over Modal */}
      {gameState.lives === 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-card border-brand-error/30 rounded-3xl overflow-hidden shadow-2xl text-white">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-brand-error/20 text-brand-error rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,75,75,0.3)]">
                <Heart size={40} className="animate-bounce fill-current" />
              </div>
              <h2 className="text-3xl font-black text-white">Sem Vidas!</h2>
              <p className="text-white/60 font-medium">
                Sua jornada foi interrompida, mas o conhecimento é eterno. Descanse um pouco e volte logo!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">XP Total</p>
                  <p className="text-2xl font-black text-brand-accent">{gameState.xp}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Nível</p>
                  <p className="text-2xl font-black text-brand-secondary">{gameState.level}</p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full btn-primary h-14 text-xl font-bold rounded-2xl"
              >
                Recomeçar Jornada
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
