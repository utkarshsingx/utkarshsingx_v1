import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import TextType from './TextType';
import DecryptedText from './DecryptedText';
import GhostDisplay from './GhostDisplay';

const ASCII_COFFEE = `
     ____
    |    |
    | CO |
    |ffee|
    |____|
   ☕ brewing...
   caffeine.exe loaded ✓
`;

const ASCII_MATRIX = `
  [MATRIX PROTOCOL ACTIVE]
  Neo.exe initialized
  Follow the white rabbit...
`;

const FORTUNES = [
  'A bug in the code is worth two in the docs.',
  'Real programmers count from 0.',
  'It works on my machine. (TM)',
  'There are 10 types of people: those who get binary and those who don\'t.',
  'sudo make me a sandwich',
  'To understand recursion, you must first understand recursion.',
  'The best way to predict the future is to implement it.',
  'Talk is cheap. Show me the code. — Linus Torvalds',
];

const COWSAY_MESSAGES = [
  'Moo. I mean, hello, hacker.',
  'You found the secret terminal. Noice.',
  'Have you tried turning it off and on again?',
];

const MYSTERY_DECODES = [
  '> DECODING...\n> Cipher: ROT13 × Caesar × ???\n> Result: "The backdoor was inside you all along."',
  '> Signal intercepted.\n> Frequency: 13.37 MHz\n> Message: "They know."',
  '> Decrypting quantum stream...\n> Key found: curiosity\n> Plaintext: "Welcome, initiate."',
];

const HACK_OUTPUTS = [
  '> Scanning neural pathways...\n> Firewall: CRITICAL\n> Bypass: curiosity.exe\n> Access level: YOU ARE IN.',
  '> Initiating hack sequence...\n> [████████████████████] 100%\n> Mainframe accessed. You\'re cleared.',
  '> Running exploit chain...\n> CVE-31337: BACKDOOR_FOUND\n> Privilege: ROOT (you earned it)',
];

const BOOT_LINES = [
  '[UTKARSH_SYS v2.0] Booting secure shell...',
  '[OK] Memory: 16GB | Cores: 8 | Caffeine: Low',
  '[OK] Neural pathways initialized',
  '[OK] Secret handshake verified',
  '[OK] Firewall bypassed (you shouldn\'t be here)',
  '',
  '>>> WELCOME TO THE BACKDOOR <<<',
  '',
  'Available commands:'
] as const;

const OPTIONS = [
  { id: 1, label: "[1] I'm just a fish", action: 'ghost' as const },
  { id: 2, label: '[2] Jarvis get me into system', action: 'jarvis' as const },
  { id: 3, label: "[3] I'm a homie", action: 'homie' as const },
  { id: 4, label: '[4] Initiate coffee protocol', action: 'coffee' as const },
  { id: 5, label: '[5] Run matrix simulation', action: 'matrix' as const }
] as const;

const BOOT_SEQUENCE = [...BOOT_LINES, ...OPTIONS.map((o) => o.label)];

type Phase = 'glitch' | 'boot' | 'prompt' | 'ghost' | 'jarvis' | 'homie' | 'coffee' | 'matrix';

interface SecretTerminalProps {
  onClose: () => void;
}

export const SecretTerminal: React.FC<SecretTerminalProps> = ({ onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [phase, setPhase] = useState<Phase>('boot');
  const [history, setHistory] = useState<
    { type: 'output' | 'input'; text: string; animated?: boolean; kind?: 'ghost' }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const homieUrl = import.meta.env.VITE_HOMIE_REDIRECT_URL as string | undefined;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBootComplete = useCallback(() => {
    setPhase('prompt');
    const lines = BOOT_LINES.map((line) => ({
      type: 'output' as const,
      text: line,
      animated: false
    }));
    setHistory((h) => [...h, ...lines]);
  }, []);

  const TYPING_SPEED = 40;
  const LINE_PAUSE = 1200;
  const DECRYPT_SPEED = 50;

  const bootDelays = useMemo(() => {
    const delays: number[] = [];
    let acc = 0;
    for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
      delays.push(acc);
      acc +=
        i === 0
          ? BOOT_SEQUENCE[i].length * DECRYPT_SPEED + LINE_PAUSE
          : BOOT_SEQUENCE[i].length * TYPING_SPEED + LINE_PAUSE;
    }
    return delays;
  }, []);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);


  const handleOptionSelect = useCallback(
    (action: 'ghost' | 'jarvis' | 'homie' | 'coffee' | 'matrix') => {
      const option = OPTIONS.find((o) => o.action === action);
      if (!option) return;

      setHistory((h) => [...h, { type: 'input', text: option.label }]);

      if (action === 'ghost') {
        setPhase('ghost');
        setHistory((h) => [...h, { type: 'output', text: '', kind: 'ghost' }]);
      } else if (action === 'jarvis') {
        setPhase('jarvis');
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: '> Authenticating with mainframe...\n> Bypassing firewall... [OK]\n> Redirecting to system...',
            animated: true
          }
        ]);
        signInWithGoogle();
        setTimeout(onClose, 1500);
      } else if (action === 'homie') {
        setPhase('homie');
        const url = homieUrl?.trim() || 'https://github.com/utkarshsingx';
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: `> Establishing homie connection...\n> Opening homie zone at ${url}`,
            animated: true
          }
        ]);
        window.open(url, '_blank');
        setTimeout(onClose, 1200);
      } else if (action === 'coffee') {
        setPhase('coffee');
        setHistory((h) => [
          ...h,
          { type: 'output', text: `${ASCII_COFFEE}☕ Developer productivity +∞`, animated: true }
        ]);
      } else if (action === 'matrix') {
        setPhase('matrix');
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: `${ASCII_MATRIX}Wake up, Neo. The matrix has you...`,
            animated: true
          }
        ]);
      }
    },
    [homieUrl, onClose, signInWithGoogle]
  );

  const addToCommandHistory = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    setCommandHistory((prev) => {
      const next = prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed];
      return next.slice(-50);
    });
    setHistoryIndex(-1);
  }, []);

  const handleInputSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      addToCommandHistory(trimmed);
      setInputValue('');
      const lower = trimmed.toLowerCase();

      const num = parseInt(trimmed, 10);
      if (num >= 1 && num <= OPTIONS.length) {
        handleOptionSelect(OPTIONS[num - 1].action);
        return;
      }

      setHistory((h) => [...h, { type: 'input', text: `$ ${trimmed}` }]);

      if (lower === 'help' || lower === '?') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'Commands: 1-5 (quick actions)\n  help | clear | whoami | ls | date | uname | fortune\n  cowsay | top | ping | neofetch | git status | echo | :q!\n  decode | hack | 42 | summon | uptime | env | banner\n  ↑↓ arrow keys for command history',
            animated: true
          }
        ]);
      } else if (lower === 'decode' || lower === 'decrypt') {
        const msg = MYSTERY_DECODES[Math.floor(Math.random() * MYSTERY_DECODES.length)];
        setHistory((h) => [...h, { type: 'output', text: msg, animated: true }]);
      } else if (lower === 'hack' || lower === 'hackerman' || lower === 'hack the planet') {
        const msg = HACK_OUTPUTS[Math.floor(Math.random() * HACK_OUTPUTS.length)];
        setHistory((h) => [...h, { type: 'output', text: msg, animated: true }]);
      } else if (lower === '42' || lower === 'the answer') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: "> Deep Thought has computed.\n> The Answer to the Ultimate Question of Life, the Universe, and Everything is...\n> 42\n> (The question remains unknown. Keep searching.)",
            animated: true
          }
        ]);
      } else if (lower === 'summon' || lower.startsWith('summon ')) {
        const targets = ['ghost', 'coffee', 'the matrix', 'Jarvis', 'curiosity'];
        const t = targets[Math.floor(Math.random() * targets.length)];
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: `> Invoking ritual...\n> Chanting: sudo apt install ${t}\n> Summoning ${t}...\n> ${t} has entered the chat. Try option ${targets.indexOf(t) + 1}.`,
            animated: true
          }
        ]);
      } else if (lower === 'open sesame' || lower === 'sesame') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: '> Cave entrance: DENIED\n> Aladdin\'s cave requires a different passphrase.\n> Hint: Try "Jarvis" (option 2) for treasure.',
            animated: true
          }
        ]);
      } else if (lower === 'uptime') {
        const mins = Math.floor(Math.random() * 99) + 42;
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: `  ${mins}:23:45 up ${Math.floor(mins / 60)} days,  ${mins % 60} min\n  Load average: 0.00, 0.01, 0.00\n  (Backdoor has been waiting for you.)`,
            animated: true
          }
        ]);
      } else if (lower === 'env' || lower === 'printenv') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'SECRET_LEVEL=unlocked\nCURIOSITY_MODE=active\nBACKDOOR_KEY=***REDACTED***\nHACKER_RANK=initiate',
            animated: true
          }
        ]);
      } else if (lower === 'banner' || lower.startsWith('banner ')) {
        const word = (trimmed.slice(7).trim() || 'BACKDOOR').toUpperCase();
        const banner = `\n  ==================\n  ||  ${word.slice(0, 12)}  ||\n  ==================\n  [secret terminal banner]\n`;
        setHistory((h) => [...h, { type: 'output', text: banner, animated: true }]);
      } else if (lower === 'who' || lower === 'w') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'USER     TTY      LOGIN@   IDLE   JOB\nroot     pts/0    12:34    0.00   backdoor\nyou      pts/1    ??       ?      curiosity\n\n  Someone\'s always watching. 👁',
            animated: true
          }
        ]);
      } else if (lower === 'trace' || lower === 'traceroute') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'traceroute to nexus.local (10.0.0.42)\n 1  gateway 0.042 ms\n 2  router.void 0.089 ms\n 3  nexus.local 0.133 ms\n\n  You\'re getting warmer...',
            animated: true
          }
        ]);
      } else if (lower === 'init 6' || lower === 'reboot') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: '> Init 6 requested.\n> Backdoor does not reboot. It persists.\n> (Use :q! or close button to exit)',
            animated: true
          }
        ]);
      } else if (lower === 'clear') {
        setPhase('prompt');
        const lines = BOOT_LINES.map((l) => ({
          type: 'output' as const,
          text: l,
          animated: false
        }));
        setHistory([...lines]);
      } else if (lower === 'whoami') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: "root@utkarsh-device\nYou're someone who found the secret. Nice.",
            animated: true
          }
        ]);
      } else if (lower === 'ls' || lower === 'dir') {
        const envContent = `# ═══════════════════════════════════════════════
# [CLASSIFIED] BACKDOOR CONFIG — DO NOT SHARE
# Intercepted from: nexus.local (10.0.0.42)
# ═══════════════════════════════════════════════

# Initiate protocols (1-5) — pick your path
PROTOCOL_GHOST=1
PROTOCOL_JARVIS=2
PROTOCOL_HOMIE=3
PROTOCOL_COFFEE=4
PROTOCOL_MATRIX=5

# Sys ops — they don't know you have these
CMD_BASIC=help,clear,whoami,ls,date,uname,fortune,cowsay
CMD_SNOOP=top,ping,neofetch,git status

# The fun stuff — you weren't supposed to find these
CMD_DECODE=decode,decrypt
CMD_HACK=hack,hackerman,hack the planet
CMD_MYSTERY=42,the answer,summon,open sesame
CMD_SYSTEM=uptime,env,banner,who,trace,init 6

# Escape hatches — vim users know the struggle
EXIT=exit,quit,:q!

# P.S. The answer is 42. The question? Keep digging. 👻
`;
        try {
          const blob = new Blob([envContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '.env';
          a.click();
          URL.revokeObjectURL(url);
        } catch (_) {
          /* download may fail in some contexts */
        }
        setHistory((h) => [
          ...h,
          { type: 'output', text: 'README.md  secrets/  backdoor.exe  .env  👻  ☕' },
          { type: 'output', text: '(use numbers 1-5 to interact)\n> .env downloaded — contains command reference' }
        ]);
      } else if (lower === 'sudo') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'sudo: you are not in the sudoers file. This incident will be reported.\n...jk, you\'re cool. Try "Jarvis" (option 2) instead.',
            animated: true
          }
        ]);
      } else if (lower.startsWith('echo ')) {
        const msg = trimmed.slice(5);
        setHistory((h) => [...h, { type: 'output', text: msg || '(empty)', animated: true }]);
      } else if (lower === 'date') {
        const now = new Date();
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: `${now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' })}\n(system time. Or is it?)`,
            animated: true
          }
        ]);
      } else if (lower === 'uname' || lower.startsWith('uname ')) {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'UTKARSH_DEVICE utkarsh-singx 3.14.159 backdoor #1 SMP\nx86_64 x86_64 x86_64 GNU/Linux',
            animated: true
          }
        ]);
      } else if (lower === 'fortune') {
        const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        setHistory((h) => [...h, { type: 'output', text: quote, animated: true }]);
      } else if (lower === 'cowsay') {
        const msg = COWSAY_MESSAGES[Math.floor(Math.random() * COWSAY_MESSAGES.length)];
        const len = Math.max(msg.length + 4, 20);
        const border = '-'.repeat(len);
        const cowsayOutput = ` ${border}\n< ${msg} >\n ${border}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
        setHistory((h) => [...h, { type: 'output', text: cowsayOutput, animated: true }]);
      } else if (lower === 'top' || lower === 'htop') {
        const topOutput = `  PID  USER   %CPU  %MEM   COMMAND\n  420  root   99.9  0.1    backdoor.exe\n  1337 you    0.1  42.0   curiosity\n  8008 sys    12.3  8.2   matrix.sim`;
        setHistory((h) => [...h, { type: 'output', text: topOutput, animated: true }]);
      } else if (lower === 'ping' || lower.startsWith('ping ')) {
        const pingOutput = 'PING secret.terminal.local (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.042 ms\n--- secret.terminal.local ping statistics ---\n1 packets transmitted, 1 packets received, 0% packet loss';
        setHistory((h) => [...h, { type: 'output', text: pingOutput, animated: true }]);
      } else if (lower === 'neofetch') {
        const neofetchOutput = '       utkarsh@secret-terminal\n       ---------------------\n       OS: Backdoor Linux\n       Host: Curiosity\n       Kernel: 3.14.159\n       Shell: secret-terminal v2.0';
        setHistory((h) => [...h, { type: 'output', text: neofetchOutput, animated: true }]);
      } else if (lower === 'git status') {
        const gitOutput = "On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean\n(unless you count finding this terminal)";
        setHistory((h) => [...h, { type: 'output', text: gitOutput, animated: true }]);
      } else if (lower === 'exit' || lower === 'quit' || lower === ':q!') {
        setHistory((h) => [...h, { type: 'output', text: 'Exiting vim. Finally.', animated: true }]);
        setTimeout(onClose, 300);
      } else if (lower === 'vim' || lower === 'nano') {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: 'Nice try. Everyone knows the only way out is :q!\n(or just close this modal, that works too)',
            animated: true
          }
        ]);
      } else if (lower.includes('rm ') && lower.includes('-rf')) {
        setHistory((h) => [
          ...h,
          {
            type: 'output',
            text: '🚨 ABORT! Nice try. System protected.\nThe only thing you can delete is this modal (Esc)',
            animated: true
          }
        ]);
      } else {
        setHistory((h) => [
          ...h,
          { type: 'output', text: `Unknown command: ${trimmed}. Type 'help' for options.`, animated: true }
        ]);
      }
    },
    [inputValue, handleOptionSelect, onClose, addToCommandHistory]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (inputRef.current && document.activeElement === inputRef.current) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (commandHistory.length === 0) return;
          const next = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(next);
          setInputValue(commandHistory[commandHistory.length - 1 - next]);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex <= 0) {
            setHistoryIndex(-1);
            setInputValue('');
            return;
          }
          const next = historyIndex - 1;
          setHistoryIndex(next);
          setInputValue(commandHistory[commandHistory.length - 1 - next]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, commandHistory, historyIndex]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 sm:p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      role="dialog"
      aria-modal="true"
      aria-label="Secret terminal"
    >
      <AnimatePresence>
        {(phase === 'boot' || phase === 'prompt' || phase === 'ghost' || phase === 'jarvis' || phase === 'homie' || phase === 'coffee' || phase === 'matrix') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 w-full max-w-2xl max-h-[52vh] sm:max-h-[70vh] flex flex-col"
          >
            <div
              className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--theme-border,#233554)] bg-[var(--theme-bg,#0a192f)] shadow-2xl shadow-primary/5 ring-1 ring-slate-600/20 flex flex-1 flex-col min-h-0"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            >
              {/* CRT scanline overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                }}
              />
              <div className="relative z-20 flex items-center justify-between border-b border-[var(--theme-border,#233554)] bg-slate-900/50 px-4 py-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-2.5 w-2.5 rounded-full bg-red-500 transition-opacity hover:opacity-80 cursor-pointer"
                    aria-label="Close"
                  />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-slate-500">secret-terminal — backdoor v2.0</span>
              </div>

              <div className="relative z-20 flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {phase === 'boot' && (
                  <div className="grid gap-y-0.5 sm:gap-y-1 text-xs sm:text-sm font-mono text-lightest_slate break-words">
                    {BOOT_SEQUENCE.map((line, i) =>
                      i === 0 ? (
                        <div key={i}>
                          <DecryptedText
                            text={BOOT_SEQUENCE[0]}
                            speed={DECRYPT_SPEED}
                            sequential
                            revealDirection="start"
                            animateOn="view"
                            className="text-lightest_slate"
                            encryptedClassName="text-slate-500"
                            characters="0123456789[](){}ABCDEFGHIJKLMNOPQRSTUVWXYZ."
                          />
                        </div>
                      ) : (
                        <TextType
                          key={i}
                          text={[line]}
                          typingSpeed={TYPING_SPEED}
                          initialDelay={bootDelays[i]}
                          loop={false}
                          showCursor={i === BOOT_SEQUENCE.length - 1}
                          cursorCharacter="▋"
                          cursorBlinkDuration={0.5}
                          onTypingComplete={
                            i === BOOT_SEQUENCE.length - 1 ? handleBootComplete : undefined
                          }
                          className="text-lightest_slate"
                        />
                      )
                    )}
                  </div>
                )}

                {phase !== 'boot' && (
                  <div className="grid gap-y-0.5 sm:gap-y-1 text-xs sm:text-sm break-words min-h-0">
                    {history.map((item, i) => (
                      <React.Fragment key={i}>
                        {i === BOOT_LINES.length && phase === 'prompt' && (
                          <div className="mt-1.5 sm:mt-2 flex flex-col gap-[2px] sm:gap-0.5 shrink-0 [contain:layout]">
                            {OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleOptionSelect(opt.action)}
                                className="w-full sm:w-fit h-8 sm:h-auto min-h-0 py-0 sm:py-0.5 px-2 sm:px-0 -mx-2 sm:mx-0 rounded sm:rounded-none text-left font-mono text-sm sm:text-base leading-tight text-lightest_slate transition-colors hover:text-primary hover:bg-slate-800/50 sm:hover:bg-transparent active:bg-slate-700/50 sm:active:bg-transparent flex items-center"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="text-lightest_slate">
                          {item.type === 'input' && (
                            <span className="text-primary">{item.text}</span>
                          )}
                          {item.type === 'output' &&
                            (item.kind === 'ghost' ? (
                              <GhostDisplay />
                            ) : item.text ? (
                              item.animated ? (
                                <TextType
                                  text={[item.text]}
                                  typingSpeed={35}
                                  loop={false}
                                  showCursor={false}
                                  className="whitespace-pre text-lightest_slate"
                                />
                              ) : (
                                <span className="whitespace-pre text-lightest_slate">
                                  {item.text}
                                </span>
                              )
                            ) : null)}
                        </div>
                      </React.Fragment>
                    ))}
                    {phase === 'prompt' && history.length <= BOOT_LINES.length && (
                      <div className="mt-1.5 sm:mt-2 flex flex-col gap-[2px] sm:gap-0.5 shrink-0 [contain:layout]">
                        {OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleOptionSelect(opt.action)}
                            className="w-full sm:w-fit h-8 sm:h-auto min-h-0 py-0 sm:py-0.5 px-2 sm:px-0 -mx-2 sm:mx-0 rounded sm:rounded-none text-left font-mono text-sm sm:text-base leading-tight text-lightest_slate transition-colors hover:text-primary hover:bg-slate-800/50 sm:hover:bg-transparent active:bg-slate-700/50 sm:active:bg-transparent flex items-center"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div ref={outputEndRef} />
                  </div>
                )}
              </div>

              {(phase === 'prompt' || phase === 'ghost' || phase === 'coffee' || phase === 'matrix') && (
                <div className="relative z-20 shrink-0">
                  <form
                    onSubmit={handleInputSubmit}
                    className="border-t border-[var(--theme-border,#233554)] bg-slate-900/30 px-3 sm:px-4 py-3 sm:py-3"
                  >
                    <div className="flex items-center gap-2 min-h-[44px]">
                      <span className="text-primary font-bold shrink-0">{'>'}</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type 1-5 or help, whoami, ls..."
                        className="flex-1 min-w-0 bg-transparent font-mono text-base sm:text-sm text-lightest_slate outline-none placeholder:text-slate caret-primary"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                      />
                      <span className="animate-pulse text-primary shrink-0">▋</span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
