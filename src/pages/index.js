import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// 核心特性列表
const FeatureList = [
  { title: '开箱即用', icon: '⚡', description: '专为技术文档与知识库打造，无需复杂配置。' },
  { title: 'Markdown 支持', icon: '📝', description: '全面支持 MDX 与富文本语法，写作如同编写代码。' },
  { title: '极速静态构建', icon: '🚀', description: '依托现代静态站点生成技术，加载性能极致优异。' },
];

// 单个视窗组件（接收 isActive 属性控制放大/缩小）
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
          <span className={styles.tabIcon}>{isDark ? '💻' : '📄'}</span>
          <span className={styles.tabTitle}>{title}</span>
        </div>
      </div>
      <div className={styles.browserContent}>
        {children}
      </div>
    </div>
  );
}

// 动态焦点画廊
function ShowcaseReel() {
  const scrollRef = useRef(null);
  // 当前聚焦的卡片索引：0 为左，1 为中，2 为右
  const [activeIndex, setActiveIndex] = useState(1);
  const activeIndexRef = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 1. 初次加载：中间居中
    let targetScroll = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollLeft = targetScroll;

    let isAnimating = false;
    let rafId = null;

    // 检查并更新当前哪张卡片该放大
    const checkActiveCard = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const progress = el.scrollLeft / maxScroll; // 滚动百分比 0 ~ 1
      let nextIndex = 1;

      if (progress < 0.28) {
        nextIndex = 0; // 滚到最左侧：第 0 张放大
      } else if (progress > 0.72) {
        nextIndex = 2; // 滚到最右侧：第 2 张放大
      } else {
        nextIndex = 1; // 处于中间：第 1 张放大
      }

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    // 2. 动量缓动动画
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

    // 3. 滚轮事件监听
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

          {/* 视窗 1（左） */}
          <BrowserWindow
            title="快速上手指南"
            isActive={activeIndex === 0}
            isDark={true}
            onClick={() => scrollToCard(0)}
          >
            {/* 可随时换成真实的 <img src="/img/screen1.png" className={styles.screenImg} /> */}
            <img
              src="/img/image_left.png"
              alt="no text"
              className={styles.screenImg}
            />
          </BrowserWindow>

          {/* 视窗 2（中） */}
          <BrowserWindow
            title="系统概览主页"
            isActive={activeIndex === 1}
            onClick={() => scrollToCard(1)}
          >
            {/* 可随时换成真实的 <img src="/img/screen2.png" className={styles.screenImg} /> */}
            <img
              src="/img/image_center.png"
              alt="no text"
              className={styles.screenImg}
            />
          </BrowserWindow>

          {/* 视窗 3（右） */}
          <BrowserWindow
            title="构建与部署"
            isActive={activeIndex === 2}
            isDark={true}
            onClick={() => scrollToCard(2)}>
            {/* 可随时换成真实的 <img src="/img/screen3.png" className={styles.screenImg} /> */}
            <img
              src="/img/image_right.png"
              alt="no text"
              className={styles.screenImg}
            />
          </BrowserWindow>

        </div>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>{siteConfig.title}</Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.actionRow}>
          <Link className={clsx('button', styles.pillPrimaryButton)} to="/docs/intro">
            立即体验 →
          </Link>
          <Link className={clsx('button', styles.pillSecondaryButton)} to="https://github.com">
            GitHub
          </Link>
        </div>
      </div>
      <ShowcaseReel />
    </header>
  );
}

function FeatureCard({ title, icon, description }) {
  return (
    <div className="col col--4">
      <div className={styles.card}>
        <div className={styles.cardIcon}>{icon}</div>
        <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <HomepageHeader />
      <main className={styles.mainSection}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <FeatureCard key={idx} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}