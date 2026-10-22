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
          message: 'A client built around forgetting: stop interacting, and the character will literally forget your story',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item1.desc',
          message: 'Why build a mechanic like this? Because even an LLM needs to forget. Forgetting prevents the context window from getting polluted with junk, and honestly—it actually gives you a reason to keep coming back and chatting with the character.',
        }),
        image: '/img/yellow.png',
        bgColor: '#fbbc04',
      },
      {
        title: translate({
          id: 'homepage.showcase.s1.item2.title',
          message: 'So how do you make the character remember your story?',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item2.desc',
          message: 'Just chat more! Keep talking, let your shared history settle and build up, and eventually it all crystallizes into data.bin.',
        }),
        bgColor: '#f9ab00',
      },
      {
        title: translate({
          id: 'homepage.showcase.s1.item3.title',
          message: 'What even is data.bin?',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item3.desc',
          message: 'data.bin is a custom database. It stores the summary chains of your conversations, not the raw chat logs word-for-word. When you reminisce about the past, it doesn’t do a dumb brute-force search over the whole file either—it uses a specific algorithm to recall only what actually mattered. Click the terminal icon on the UI to pop open the TUI, type the save command, and boom: your current summary chain is saved.',
        }),
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
          message: 'Driving the plot forward through parallel universes',
        }),
        desc: translate({
          id: 'homepage.showcase.s2.item1.desc',
          message: 'Why design this? Because advancing a storyline requires trial and error. If a dialogue goes downhill or gets boring, just discard it—exactly like a novelist striking through a bad paragraph. The UI reflects this too: switch back to the main timeline, and all side-branch bubbles get strikethrough lines, hinting they were discarded (though it doesn’t physically wipe them out). If the side story turned out great, you can merge it. Heads up: merging actually clears the side-chain summaries, grafting only the very last node’s summary onto the main timeline.',
        }),
        image: '/img/blue.png',
        bgColor: '#4285f4',
      },
      {
        title: translate({
          id: 'homepage.showcase.s2.item2.title',
          message: 'So you mean discarding is actually a good thing?',
        }),
        desc: translate({
          id: 'homepage.showcase.s2.item2.desc',
          message: 'Yes, that’s exactly what I mean. Real writers write novels by constantly discarding drafts—they rarely "merge" cleanly. I want to preserve the user’s trial-and-error journey, just like looking at an author’s raw manuscript full of crossed-out pages.',
        }),
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
          message: 'Privacy first',
        }),
        desc: translate({
          id: 'homepage.showcase.s3.item1.desc',
          message: 'No login, no sign-up—because it simply never needed one in the first place. No SQL-style database storing your chat history, because there is no reason to hoard your private logs anyway. If you want a backup, just click export to a .txt file and throw it into whatever folder you like.',
        }),
        image: '/img/green.png',
        bgColor: '#34a853',
      },
      {
        title: translate({
          id: 'homepage.showcase.s3.item2.title',
          message: 'Prompt crafting with YAML',
        }),
        desc: translate({
          id: 'homepage.showcase.s3.item2.desc',
          message: 'At least this is way less of a headache to write than JSON.',
        }),
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
// Showcase Reel Component (已修复点击无响应与冲突问题)
// =========================================
function ShowcaseReel() {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const activeIndexRef = useRef(1);

  // 用 ref 保存动画相关的状态，确保点击函数和滚轮事件能共享控制
  const animStateRef = useRef({
    targetScroll: 0,
    isAnimating: false,
    rafId: null,
  });

  // 统一的平滑滚动驱动器
  const animateTo = (target) => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const clampedTarget = Math.max(0, Math.min(maxScroll, target));
    animStateRef.current.targetScroll = clampedTarget;

    if (animStateRef.current.isAnimating) return;

    animStateRef.current.isAnimating = true;

    const updateScroll = () => {
      const current = el.scrollLeft;
      const diff = animStateRef.current.targetScroll - current;

      if (Math.abs(diff) > 0.5) {
        el.scrollLeft += diff * 0.12; // 缓动因子
        checkActiveCard();
        animStateRef.current.rafId = requestAnimationFrame(updateScroll);
      } else {
        el.scrollLeft = animStateRef.current.targetScroll;
        checkActiveCard();
        animStateRef.current.isAnimating = false;
      }
    };

    animStateRef.current.rafId = requestAnimationFrame(updateScroll);
  };

  const checkActiveCard = () => {
    const el = scrollRef.current;
    if (!el) return;
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 初始居中到第 2 个卡片
    const initialScroll = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollLeft = initialScroll;
    animStateRef.current.targetScroll = initialScroll;

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const isScrollingDown = e.deltaY > 0;
      const current = animStateRef.current.targetScroll;

      const isAtRight = current >= maxScroll - 8;
      const isAtLeft = current <= 8;

      // 如果已经在边缘且继续同方向滑动，把滚轮控制权还给外层页面纵向滚动
      if ((isScrollingDown && isAtRight) || (!isScrollingDown && isAtLeft)) {
        return;
      }

      e.preventDefault();
      animateTo(current + e.deltaY * 1.5);
    };

    const handleNativeScroll = () => {
      if (!animStateRef.current.isAnimating) {
        animStateRef.current.targetScroll = el.scrollLeft;
        checkActiveCard();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleNativeScroll);
      if (animStateRef.current.rafId) {
        cancelAnimationFrame(animStateRef.current.rafId);
      }
    };
  }, []);

  // 点击卡片：精准根据 DOM 位置把卡片居中到视口
  const scrollToCard = (index) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const cards = track.children;
    if (!cards[index]) return;

    const card = cards[index];
    // 计算让卡片正好处于容器水平正中央的 scrollLeft
    const target = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;

    setActiveIndex(index);
    activeIndexRef.current = index;
    animateTo(target);
  };

  return (
    <div className={styles.showcaseOuterWrapper}>
      <div className={styles.showcaseWrapper} ref={scrollRef}>
        <div className={styles.showcaseTrack} ref={trackRef}>
          <BrowserWindow
            title="DB view"
            isActive={activeIndex === 0}
            isDark={true}
            onClick={() => scrollToCard(0)}
          >
            <img src="/img/left.png" alt="Memory Decay and Weights" className={styles.screenImg} />
          </BrowserWindow>

          <BrowserWindow
            title="UI"
            isActive={activeIndex === 1}
            isDark={true}
            onClick={() => scrollToCard(1)}
          >
            <img src="/img/center.png" alt="Dialogue Branching Workspace" className={styles.screenImg} />
          </BrowserWindow>

          <BrowserWindow
            title="log"
            isActive={activeIndex === 2}
            isDark={true}
            onClick={() => scrollToCard(2)}
          >
            <img src="/img/right.png" alt="AST RAG Engine" className={styles.screenImg} />
          </BrowserWindow>
        </div>
      </div>
    </div>
  );
}

// =========================================
// 联动特性展台组件 (固定只显示第一张图)
// =========================================
function InteractiveShowcase({ sectionData, reverse = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // 固定使用该分类的第 1 个条目作为图片展示源
  const firstItem = sectionData.items[0];

  return (
    <div className={clsx(styles.featureShowcase, reverse && styles.reverse)}>
      {/* 视觉区：永远固定显示第一张图片 */}
      <div className={styles.showcaseVisual}>
        {firstItem && (
          <img
            src={firstItem.image}
            alt={firstItem.title}
            className={styles.showcaseInnerImg}
          />
        )}
      </div>

      {/* 文本列表区：依然支持点击切换查看对应说明 */}
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