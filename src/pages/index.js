import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Translate, { translate } from '@docusaurus/Translate';

// =========================================
// 3 Showcase Sections (Data Source)
// =========================================
const getShowcaseSections = () => [
  // Section 1: Forgetting Mechanism & Dynamic Memory Rank (Yellow/Orange)
  {
    items: [
      {
        title: translate({
          id: 'homepage.showcase.s1.item1.title',
          message: 'The Philosophy of Forgetting: Taming Context Drift',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item1.desc',
          message: 'LLMs should not hoard trivial interactions. Indiscriminate history accumulation dilutes attention and inflates token budgets. Strategic pruning keeps the reasoning path sharp and focused.',
        }),
        image: '/img/yellow.png',
        bgColor: '#fbbc04',
      },
      {
        title: translate({
          id: 'homepage.showcase.s1.item2.title',
          message: 'Dynamic Weight Decay & data.bin Storage',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item2.desc',
          message: 'Every memory node is dynamically scored based on access frequency, semantic importance, and temporal decay, then persisted compactly into a zero-overhead binary storage.',
        }),
        image: '/img/showcase-weight.png',
        bgColor: '#f9ab00',
      },
      {
        title: translate({
          id: 'homepage.showcase.s1.item3.title',
          message: 'Heaviest Memory Recall Engine',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item3.desc',
          message: 'Under constrained context windows, GGUF Libra automatically prioritizes and injects the highest-weighted historical invariants into prompts, ensuring consistent persona and facts.',
        }),
        image: '/img/showcase-recall.png',
        bgColor: '#e37400',
      },
    ],
  },

  // Section 2: Git-Style Dialogue Branching (Blue - Reverse)
  {
    items: [
      {
        title: translate({
          id: 'homepage.showcase.s2.item1.title',
          message: 'Git-Style Dialogue Trees & Context Isolation',
        }),
        desc: translate({
          id: 'homepage.showcase.s2.item1.desc',
          message: 'Fork conversations at any turn. Experiment with diverse prompts, edge-case tests, or debug sessions in parallel without polluting your primary chat history.',
        }),
        image: '/img/blue.png',
        bgColor: '#4285f4',
      },
      {
        title: translate({
          id: 'homepage.showcase.s2.item2.title',
          message: 'Cross-Branch Context Handover',
        }),
        desc: translate({
          id: 'homepage.showcase.s2.item2.desc',
          message: 'Concluded an exploratory branch? Distill its core takeaways into structured summaries and propagate them back into the main timeline effortlessly.',
        }),
        image: '/img/showcase-summary.png',
        bgColor: '#1a73e8',
      },
    ],
  },

  // Section 3: AST-Based Code Chunking & Local-First Architecture (Green)
  {
    items: [
      {
        title: translate({
          id: 'homepage.showcase.s3.item1.title',
          message: 'AST-Aware Chunking: Syntax-Preserving Code RAG',
        }),
        desc: translate({
          id: 'homepage.showcase.s3.item1.desc',
          message: 'Beyond arbitrary fixed-character splitting. Tree-sitter parses the concrete syntax trees of Go, Python, and C/C++, isolating coherent scopes, classes, and complete functions.',
        }),
        image: '/img/green.png',
        bgColor: '#34a853',
      },
      {
        title: translate({
          id: 'homepage.showcase.s3.item2.title',
          message: 'Zero Bloat: Pure Go Backend & Native Web UI',
        }),
        desc: translate({
          id: 'homepage.showcase.s3.item2.desc',
          message: 'Built with Go standard library and dependency-free vanilla web technologies. Native integration with llama.cpp/llama-server. No heavy database daemons, 100% private and offline-capable.',
        }),
        image: '/img/showcase-local.png',
        bgColor: '#1e8e3e',
      },
    ],
  },
];

// =========================================
// macOS Mimic Browser Window
// =========================================
function BrowserWindow({ title, isActive, isDark, onClick, children }) {
  return (
    <div
      onClick={onClick}
      style={{ cursor: isActive ? 'default' : 'pointer' }}
      className={clsx(
        styles.browserCard,
        isActive ? styles.activeCard : styles.inactiveCard,
        isDark && styles.darkWindow
      )}>
      <div className={styles.browserHeader}>
        <div className={styles.windowControls}>
          <span className={clsx(styles.macDot, styles.dotRed)} />
          <span className={clsx(styles.macDot, styles.dotYellow)} />
          <span className={clsx(styles.macDot, styles.dotGreen)} />
        </div>
        <div className={styles.browserTab}>
          <span className={styles.tabIcon}>{isDark ? '💻' : '⚡'}</span>
          <span className={styles.tabTitle}>{title}</span>
        </div>
      </div>
      <div className={styles.browserContent}>
        {children}
      </div>
    </div>
  );
}

// =========================================
// Showcase Reel Component
// =========================================
function ShowcaseReel() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const activeIndexRef = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let targetScroll = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollLeft = targetScroll;

    let isAnimating = false;
    let rafId = null;

    const checkActiveCard = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const progress = el.scrollLeft / maxScroll;
      let nextIndex = 1;

      if (progress < 0.28) {
        nextIndex = 0;
      } else if (progress > 0.72) {
        nextIndex = 2;
      } else {
        nextIndex = 1;
      }

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const updateScroll = () => {
      const current = el.scrollLeft;
      const diff = targetScroll - current;

      if (Math.abs(diff) > 0.5) {
        el.scrollLeft += diff * 0.12;
        checkActiveCard();
        rafId = requestAnimationFrame(updateScroll);
      } else {
        el.scrollLeft = targetScroll;
        checkActiveCard();
        isAnimating = false;
      }
    };

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const isScrollingDown = e.deltaY > 0;

      const isAtRight = targetScroll >= maxScroll - 8;
      const isAtLeft = targetScroll <= 8;

      if ((isScrollingDown && isAtRight) || (!isScrollingDown && isAtLeft)) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, behavior: 'auto' });
        return;
      }

      e.preventDefault();
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY * 1.5));

      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    const handleNativeScroll = () => {
      if (!isAnimating) {
        targetScroll = el.scrollLeft;
        checkActiveCard();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleNativeScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToCard = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (index === 0) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (index === 1) {
      el.scrollTo({ left: maxScroll / 2, behavior: 'smooth' });
    } else if (index === 2) {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.showcaseOuterWrapper}>
      <div className={styles.showcaseWrapper} ref={scrollRef}>
        <div className={styles.showcaseTrack}>
          <BrowserWindow
            title="Memory Decay & Weights"
            isActive={activeIndex === 0}
            isDark={true}
            onClick={() => scrollToCard(0)}
          >
            <img src="/img/showcase-memory.png" alt="Memory Decay and Weights" className={styles.screenImg} />
          </BrowserWindow>

          <BrowserWindow
            title="Git-Style Branching Workspace"
            isActive={activeIndex === 1}
            isDark={true}
            onClick={() => scrollToCard(1)}
          >
            <img src="/img/showcase-main.png" alt="Dialogue Branching Workspace" className={styles.screenImg} />
          </BrowserWindow>

          <BrowserWindow
            title="AST-Aware Code RAG Engine"
            isActive={activeIndex === 2}
            isDark={true}
            onClick={() => scrollToCard(2)}
          >
            <img src="/img/showcase-ast.png" alt="AST RAG Engine" className={styles.screenImg} />
          </BrowserWindow>
        </div>
      </div>
    </div>
  );
}

// =========================================
// 联动特性展台组件 (纯图片展示版)
// =========================================
function InteractiveShowcase({ sectionData, reverse = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = sectionData.items[activeIndex] || sectionData.items[0];

  return (
    <div className={clsx(styles.featureShowcase, reverse && styles.reverse)}>
      {/* 视觉区：直接完整展示图片卡片 */}
      <div className={styles.showcaseVisual}>
        <img
          key={current.image} /* 加 key 可以在切换图片时触发平滑淡入动画 */
          src={current.image}
          alt={current.title}
          className={styles.showcaseInnerImg}
        />
      </div>

      {/* 文本列表区保持不变 */}
      <div className={styles.showcaseContent}>
        {sectionData.items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              className={clsx(styles.featureItem, isActive && styles.active)}
              onClick={() => setActiveIndex(idx)}
            >
              <Heading as="h3" className={styles.featureItemTitle}>
                {item.title}
              </Heading>
              {isActive && (
                <p className={styles.featureItemDesc}>
                  {item.desc}
                </p>
              )}
            </div>
          );
        })}

        {sectionData.ctaText && (
          <div className={styles.showcaseCta}>
            <Link className={styles.ctaLink} to={sectionData.ctaLink || '#'}>
              {sectionData.ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================
// Hero Header Section (左右分栏布局)
// =========================================
function HomepageHeader() {
  return (
    <header className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroSplit}>
          {/* 左侧：文字与按钮 */}
          <div className={styles.heroContent}>
            <Heading as="h1" className={styles.heroTitle}>GGUF Libra</Heading>
            <p className={styles.heroSubtitle}>
              <Translate id="homepage.tagline">
                A role play focused client built specifically for local LLMs
              </Translate>
            </p>
            <div className={styles.actionRow}>
              <Link className={clsx('button', styles.pillPrimaryButton)} to="https://github.com/ckcool6/GGUF_Libra/releases">
                <Translate id="homepage.button.getStarted">Windows Download</Translate>
              </Link>
              <Link
                className={clsx('button', styles.pillSecondaryButton)}
                to="https://github.com/ckcool6/GGUF_Libra"
              >
                GitHub
              </Link>
            </div>
          </div>

          {/* 右侧：图片展示区 */}
          <div className={styles.heroImageWrapper}>
            <img
              src="/img/hero.jpg" // 换成你在 static/img/ 下的图片文件名
              alt="GGUF Libra Workspace Preview"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>

      {/* 下方的拟态横向画廊依然保留 */}
      <ShowcaseReel />
    </header>
  );
}

// =========================================
// Main Entry Page
// =========================================
export default function Home() {
  const showcaseSections = getShowcaseSections();

  return (
    <Layout
      title="GGUF Libra"
      description="Local LLM client designed with a forgetting mechanism, branching conversation trees, and AST-level code chunking."
    >
      <HomepageHeader />
      <main className={styles.mainShowcaseSection}>
        <div className="container">
          <InteractiveShowcase
            sectionData={showcaseSections[0]}
            reverse={false}
          />
          <InteractiveShowcase
            sectionData={showcaseSections[1]}
            reverse={true}
          />
          <InteractiveShowcase
            sectionData={showcaseSections[2]}
            reverse={false}
          />
        </div>
      </main>
    </Layout>
  );
}